const fs = require('fs-extra')
const ipLocation = require('iplocation')
const parallel = require('async-parallel')

async function main() {
  const accessListBuffer = await fs.readFile('./accessList.txt')
  const accessListString = accessListBuffer.toString()
  const accessList = accessListString.split('\n').slice(0, 150)

  // Transform to objects
  const accessListObjects = accessList
    .map(line => {
      const [ip, url] = line.split(' ')
      return {
        ip, url
      }
    })

  // Parse category from URL
  const accessListWithCategory = accessListObjects
    .map(access => {
      const match = access.url.match(/\/category\/([a-z0-9]*)/i)
      return Object.assign({}, access, {
        category: match ? match[1] : null
      })
    })

  // Get location for each access
  const accessListWithLocation = await parallel
    .map(accessListWithCategory, async access => Object.assign({}, access, {
      location: await ipLocation(access.ip)
    }))

  const accessListWithValidLocation = accessListWithLocation
    .filter(access => access.location.city)

  await fs.writeJSON('result.json', accessListWithValidLocation)
  console.info('Ready!')
}

main()
