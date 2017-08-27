const fs = require('fs')

const list = [
  '/category/fishing',
  '/category/gardening',
  '/category/fitness',
  '/category/camping',
  '/category/recreating',
  '/category/hunting',
]

const text = fs.readFileSync('./ipList.txt')
fs.writeFileSync(
  './accessList.txt',
  text.toString().replace(/\n/g, () => ` ${list[Math.floor(Math.random() * (list.length))]}\n`).trim()
)
