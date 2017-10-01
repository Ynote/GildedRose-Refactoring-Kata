class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const itemRules = (item, rules) => {
  return rules.filter(rule => rule.item(item))[0].rules
}

const itemRule = (item, rules) => {
  return rules.filter(rule => {
    if (!rule.predicate) return true

    return rule.predicate(item)
  })[0]
}

const isBasic = item => {
  return !isConjured(item) &&
    !isBackstagePasses(item) &&
    !isLegendary(item) &&
    !isAgedBrie(item)
}

const isConjured = item => {
  return item.name.match(/^Conjured/)
}

const isBackstagePasses = item => {
  return item.name.match(/^Backstage passes/)
}

const isLegendary = item => {
  return item.name.match(/^Sulfuras/)
}

const isAgedBrie = item => {
  return item.name.match(/^Aged Brie/)
}

const isExpired = item => {
  return item.sellIn <= 0
}

const backstagePassesPredicates = {
  isLimited: item => item.sellIn > 0 && item.sellIn <= 3,
  isFresh: item => {
    if (backstagePassesPredicates.isLimited(item)) return false

    return item.sellIn > 0 && item.sellIn <= 10
  },
  isEarlyBird: item => {
    return item.sellIn > 10
  },
}

const update = (item, options) => {
  const attributes = Object.keys(options)

  attributes.forEach(attribute => {
    item[attribute] += attributeDelta(attribute, options[attribute], item)
  })

  return item
}

const isQuality = attribute => attribute == 'quality'
const canUpdateQuality = currentQuality => {
  return currentQuality > 0 && currentQuality < 50
}

const attributeDelta = (attribute, value, item) => {
  if (isQuality(attribute) && !canUpdateQuality(item.quality)) return 0

  return value
}

const rules = [
  {
    item: isBasic,
    rules: [
      {
        predicate: item => !isExpired(item),
        deltas: {
          quality: -1,
          sellIn: -1,
        },
      },
      {
        predicate: isExpired,
        deltas: {
          quality: -2,
          sellIn: -1,
        }
      },
    ],
  },
  {
    item: isAgedBrie,
    rules: [
      {
        predicate: item => !isExpired(item),
        deltas: {
          quality: 1,
          sellIn: -1,
        },
      },
      {
        predicate: isExpired,
        deltas: {
          quality: 2,
          sellIn: -1,
        },
      },
    ]
  },
  {
    item: isLegendary,
    rules: [
      {
        deltas: {
          quality: 0,
          sellIn: 0,
        },
      }
    ]
  },
  {
    item: isConjured,
    rules: [
      {
        predicate: item => !isExpired(item),
        deltas: {
          quality: -2,
          sellIn: -1,
        },
      },
      {
        predicate: isExpired,
        deltas: {
          quality: -4,
          sellIn: -1,
        }
      },
    ]
  },
  {
    item: isBackstagePasses,
    rules: [
      {
        predicate: isExpired,
        deltas: {
          quality: item => item.quality * -1,
          sellIn: -1,
        },
      },
      {
        predicate: backstagePassesPredicates.isLimited,
        deltas: {
          quality: 3,
          sellIn: -1,
        }
      },
      {
        predicate: backstagePassesPredicates.isFresh,
        deltas: {
          quality: 2,
          sellIn: -1,
        }
      },
      {
        predicate: backstagePassesPredicates.isEarlyBird,
        deltas: {
          quality: 1,
          sellIn: -1,
        }
      },
    ]
  },
]

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() {
    return this.items.map(item => {
      const currentItemRules = itemRules(item, rules)
      const currentRule = itemRule(item, currentItemRules)

      let quality = currentRule.deltas.quality

      if (typeof quality == 'function') {
        quality = currentRule.deltas.quality(item)
      }

      const options = {
        quality: quality,
        sellIn: currentRule.deltas.sellIn,
      }

      return update(item, options)
    })
  }
}
