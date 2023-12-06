import type { QwikSubmitEvent} from "@builder.io/qwik";
import { $, component$, useStore } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { z } from 'zod'
import OpenAI from "openai";
import { PromptTemplate } from 'langchain/prompts'
import party from 'party-js'
import { Input, Dialog, Svg } from "~/components";
import { jsFormSubmit } from "~/utils";
import allFighters from './fighters.js'

const template = `You're a professional fighting judge. Who would win in a fight between {opponent1} ("opponent1") and {opponent2} ("opponent2")? Only tell me who the winner is and a short reason why.

Format the response like this:
"winner: opponent1 or opponent2. reason: the reason they won."

Return the winner using only their label ("opponent1" or "opponent2") and not their name.`
const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ['opponent1', 'opponent2'],
})

export const onPost: RequestHandler = async (requestEvent) => {
  const formData = await requestEvent.parseBody()

  const validation = z.object({
    opponent1: z.string().min(1).max(60),
    opponent2: z.string().min(1).max(60),
  }).safeParse(formData)

  if (!validation.success) {
    requestEvent.json(400, {
      errors: validation.error.issues
    })
    return 
  }

  const openai = new OpenAI({
    apiKey: requestEvent.env.get('OPENAI_API_KEY'),
  });

  const prompt = await promptTemplate.format({
    opponent1: validation.data.opponent1,
    opponent2: validation.data.opponent2
  })

  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    max_tokens: 300,
    temperature: 1,
    stream: true
  });

  const writer = requestEvent.getWritableStream().getWriter()
  const encoder = new TextEncoder()

  for await (const chunk of response) {
    const text = chunk.choices[0].delta.content || ''
    writer.write(encoder.encode(text))
  }
  writer.close();
}

export default component$(() => {
  const state = useStore({
    isLoading: false,
    text: '',
    winner: '',
    opponent1: '',
    opponent2: '',
  })

  const handleSubmit = $(async (event: QwikSubmitEvent) => {
    state.isLoading = true
    state.text = ''
    state.winner = ''

    const form = event.target as HTMLFormElement

    const response = await jsFormSubmit(form)

    if (!response.ok) {
      state.isLoading = false
      alert("The request experienced an issue.")
      return
    }

    if (!response.body) {
      state.isLoading = false
      return
    }

    // Parse streaming body
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let isStillStreaming = true

    while(isStillStreaming) {
      const {value, done} = await reader.read()
      const chunkValue = decoder.decode(value)
      
      state.text += chunkValue

      isStillStreaming = !done
    }

    const winnerPattern = /winner:\s+(\w+).*/gi
    const match = winnerPattern.exec(state.text)

    state.winner = match?.length ? match[1].toLowerCase() : ''

    if (state.winner) {
      const winnerInput = document.querySelector(`textarea[name=${state.winner}]`)
      if (winnerInput) {
        party.confetti(winnerInput, {
          count: 40,
          size: 2,
          spread: 15
        })
      }
    }
    
    state.isLoading = false
  })

  const createInputHandler = (key) => $((event) => {
    state.winner = ''
    state.text = ''
    state[key] = event.target.value
  })

  const imgState = useStore({
    showDialog: false,
    isLoading: false,
    url: ''
  })
  const onSubmitImg = $(async (event: QwikSubmitEvent) => {
    imgState.showDialog = true
    imgState.isLoading = true

    const form = event.target as HTMLFormElement

    const response = await jsFormSubmit(form)
    const results = await response.json()

    imgState.url = results.url
    imgState.isLoading = false
  })

  const pickRandomFighters = $(() => {
    state.text = ''
    state.winner = ''

    const fighters = [...allFighters]
    const index1 = Math.floor(Math.random() * fighters.length)
    const [fighter1] = fighters.splice(index1, 1)
    const index2 = Math.floor(Math.random() * fighters.length)
    const fighter2 = fighters[index2]

    state.opponent1 = fighter1
    state.opponent2 = fighter2
  })

  return (
    <main class="max-w-4xl mx-auto p-4">
      <h1 class="text-4xl">AI of the Tiger</h1>
      <p>An AI bot that will determine who would win in a fight between...</p>

      <form 
        method="post"
        class="grid gap-4 mt-8"
        preventdefault:submit
        onSubmit$={handleSubmit}
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <Input
            label="Opponent 1"
            name="opponent1"
            value={state.opponent1}
            class={{
              rainbow: state.winner === 'opponent1'
            }}
            required
            maxLength="100"
            onInput$={createInputHandler('opponent1')}
          />
          <Input
            label="Opponent 2"
            name="opponent2"
            value={state.opponent2}
            class={{
              rainbow: state.winner === 'opponent2'
            }}
            required
            maxLength="100"
            onInput$={createInputHandler('opponent2')}
          />
        </div>

        <div class="flex gap-4">
          <button type="submit" aria-disabled={state.isLoading}>
            {state.isLoading ? <Svg alt="Loading" icon="icon-spinner" /> : 'Tell me'}
          </button>
          <button type="button" title="Feeling lucky?" onClick$={pickRandomFighters}>
            <Svg alt="Pre-fill random fighter" icon="icon-random" />
          </button>
        </div>
      </form>

      {state.text && (
        <article class="mt-4 border border-2 rounded-lg p-4 bg-[canvas]">
          <p>{state.text.slice(27)}</p>
        </article>
      )}

      {state.winner && (
        <form
          action="/ai-image"
          preventdefault:submit
          onSubmit$={onSubmitImg}
          class="mt-4"
        >
          <input
            type="hidden"
            name="opponent1"
            value={state.opponent1}
            required
          />
          <input
            type="hidden"
            name="opponent2"
            value={state.opponent2}
            required
          />
          <input
            type="hidden"
            name="winner"
            value={state.winner}
            required
          />
          <button type="submit">
            Show me
          </button>
        </form>
      )}

      <Dialog
        toggle={false}
        open={imgState.showDialog}
        onClose$={() => imgState.showDialog = false}
      >
        {imgState.isLoading && (
          <Svg alt="Loading" icon="icon-spinner" class="text-8xl" />
        )}
        {!imgState.isLoading && imgState.url && (
          <img src={imgState.url} alt={`An epic battle between ${state.opponent1} and ${state.opponent2}`} />
        )}
      </Dialog>

      <p class="my-10 sm:mt-20 text-center">Disclaimer: This app uses AI to generate content, so things may come out a lil' wonky.</p>
    </main>
  );
});
