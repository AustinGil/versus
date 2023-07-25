import { component$ } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";

export const usePromptAction = routeAction$(async (formData, requestEvent) => {
  const OPENAI_API_KEY = requestEvent.env.get('OPENAI_API_KEY')

  const prompt = formData.prompt
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body)
  })
  const data = await response.json()

  return data.choices[0].message.content
})

export default component$(() => {
  const action = usePromptAction()

  return (
    <main class="max-w-4xl mx-auto p-4">
      <h1 class="text-4xl">Hi 👋</h1>

      <Form action={action} class="grid gap-4">
        <div>
          <label for="prompt">Prompt</label>
          <textarea name="prompt" id="prompt">
            Tell me a joke
          </textarea>
        </div>

        <div>
          <button type="submit" aria-disabled={action.isRunning}>
            {action.isRunning ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </Form>

      {action.value && (
        <article class="mt-4 border border-2 rounded-lg p-4 bg-[canvas]">
          <p>{action.value}</p>
        </article>
      )}
    </main>
  );
});
