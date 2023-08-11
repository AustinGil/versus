import { PromptTemplate } from 'langchain/prompts'

const mods = [
  /** Style */
  // 'Abstract',
  // 'Academic',
  // 'Action painting',
  // 'Aesthetic',
  // 'Angular',
  // 'Automatism',
  // 'Avant-garde',
  // 'Baroque',
  // 'Bauhaus',
  // 'Contemporary',
  // 'Cubism',
  // 'Cyberpunk',
  // 'Digital art',
  // 'photo',
  // 'vector art',
  // 'Expressionism',
  // 'Fantasy',
  // 'Impressionism',
  // 'kiyo-e',
  // 'Medieval',
  // 'Minimal',
  // 'Modern',
  // 'Pixel art',
  // 'Realism',
  // 'sci-fi',
  // 'Surrealism',
  // 'synthwave',
  // '3d-model',
  // 'analog-film',
  // 'anime',
  // 'comic-book',
  // 'enhance',
  // 'fantasy-art',
  // 'isometric',
  // 'line-art',
  // 'low-poly',
  // 'modeling-compound',
  // 'origami',
  // 'photographic',
  // 'tile-texture',

  /** Format */
  // '3D render',
  // 'Blender Model',
  // 'CGI rendering',
  'cinematic',
  // 'Detailed render',
  // 'oil painting',
  // 'unreal engine 5',
  // 'watercolor',
  // 'cartoon',
  // 'anime',
  // 'colored pencil'

  /** Quality */
  'high resolution',
  // 'high-detail',
  // 'low-poly',
  // 'photographic',
  // 'photorealistic',
  // 'realistic',

  /** Effects */
  // 'Beautiful lighting',
  // 'Cinematic lighting',
  // 'Dramatic',
  // 'dramatic lighting',
  // 'Dynamic lighting',
  'epic',
  // 'Portrait lighting',
  // 'Volumetric lighting',
];

const promptTemplate = new PromptTemplate({
  template: `{opponent1} and {opponent2} in a battle to the death, ${mods.join(', ')}`,
  inputVariables: ['opponent1', 'opponent2']
})

/** @type {import('@builder.io/qwik-city').RequestHandler} */
export const onGet = async (requestEvent) => {
  const OPENAI_API_KEY = requestEvent.env.get('OPENAI_API_KEY')

  const opponent1 = requestEvent.query.get('opponent1')
  const opponent2 = requestEvent.query.get('opponent2')

  const prompt = await promptTemplate.format({
    opponent1: opponent1,
    opponent2: opponent2
  })

  const body = {
    prompt: prompt,
    size: '512x512',
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body)
  })
  const results = await response.json()

  requestEvent.send(200, JSON.stringify(results.data[0]))
}
