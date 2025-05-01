import { defineWxtModule } from 'wxt/modules'
import fs from 'fs'

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('prepare:types', async (_, entries) => {
      try {
        const content = fs.readFileSync('typings/types.d.ts', 'utf8')
        entries.push({
          path: 'types/types.d.ts',
          text: content,
          // IMPORTANT - without this line your declaration file will not be a part of the TS project:
          tsReference: true,
        })
      } catch (err) {
        console.error(err)
      }
    })
  },
})
