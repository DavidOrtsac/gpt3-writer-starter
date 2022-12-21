import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix =
`
Expand the following idea/thought and turn it into a debate topic:

Prompt:
`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 100,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  //Prompt #2.
  const secondPrompt = 
  `
Create two characters that are debating against each other. Write the Statement at the start of the debate. The first character's name is Side One, and he will defend the Statement by speaking in detailed, persuasive and logical essays proving his point. The second character's name is Side Two, and he will argue against the Statement by speaking in persuasive and logical essays. Side Two is a bit aggressive.
Make them take two turns each. End the debate with an unbiased summary.

Statement: ${req.body.userInput}

Question: ${basePromptOutput.text}

The Debate:
  `
  
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 1550,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;