interface item {
  label: unknown
  items: item[]
}

export default function unflattenTree(flatTree: item[], groups?: string[]) {
  let output: item[] = []

  flatTree.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]: [unknown, unknown]) => {
      if (groups === undefined) {
        const existingInnerObj = output.find(({ label }) => label === value)
        if (existingInnerObj) {
          output = existingInnerObj.items
        } else {
          const newObj = { label: value, items: [] }
          output.push(newObj)
          output = newObj.items
        }
      } else if (key === groups[0]) {
        const existingInnerObj = output.find(({ label }) => label === value)

        if (existingInnerObj) {
          existingInnerObj.items = flatTree.filter((item) => item[key] === existingInnerObj.label)
        } else {
          const newObj: { label: unknown; items: item[] } = {
            label: value,
            items: [],
          }
          newObj.items = flatTree.filter((item) => item[key] === newObj.label)
          output.push(newObj)
        }
      }
    })
  })

  return output
}
