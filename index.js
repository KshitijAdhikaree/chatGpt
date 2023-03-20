const { Configuration, OpenAIApi } = require('openai')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const configuration = new Configuration({
  organization: 'org-RAf5RA0jpmvhYDVSINb5fx0s',
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

//create a simple express api that calls the funciton above

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(cors())

app.get('/models', async (req, res) => {
  const response = await openai.listEngines()
  console.log(response.data.data)
  res.json({
    models: response.data,
  })
})

app.post('/', async (req, res) => {
  const { message, currentModel } = req.body
  //console.log('message', message)
  //console.log(currentModel)
  const response = await openai.createCompletion({
    model: currentModel, //'text-davinci-003',
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  })
  res.json({
    //data: response.data,
    message: response.data.choices[0].text,
    currentModel,
  })
})

app.listen(port, () => {
  console.log(`Server is Listening on port ${port}`)
})
