export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    let body = ''
    for await (const chunk of req) {
      body += chunk
    }
    const { apikey, namespace, offset, limit } = JSON.parse(atob(body))
    const response = await fetch(
      `https://api.testmail.app/api/json?apikey=${apikey}&namespace=${namespace}&pretty=true&offset=${offset || 0}&limit=${limit || 10}`
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
