// Each rule should be exclusive, so we pick the first matching one.
const itemRules = (item, rules) => {
  return rules.filter(rule => rule.item(item))[0].rules
}

const itemRule = (item, rules) => {
  return rules.filter(rule => {
    if (!rule.predicate) return true

    return rule.predicate(item)
  })[0]
}

// Items rules
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

// Items rules predicates
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

// Updates methods
const canUpdateQuality = currentQuality => (
  currentQuality > 0 && currentQuality < 50
)

const updateQuality = quality => item => {
  if (!canUpdateQuality(item.quality)) return item

  return (item.quality += quality, item)
}

const updateSellIn = sellIn => item => (item.sellIn += sellIn, item)

// Update strategy
const _pipe = (f, g) => (...args) => g(f(...args))
const pipe = (...fns) => fns.reduce(_pipe)

const update = options => item => {
  const attributes = Object.keys(options)
  const updates = attributes.map(attribute => options[attribute])
  const updateAttributes = pipe.apply(this, updates)

  return updateAttributes(item)
}

const rules = [
  {
    item: isBasic,
    rules: [
      {
        predicate: item => !isExpired(item),
        updates: {
          quality: updateQuality(-1),
          sellIn: updateSellIn(-1),
        },
      },
      {
        predicate: isExpired,
        updates: {
          quality: updateQuality(-2),
          sellIn: updateSellIn(-1),
        }
      },
    ],
  },
  {
    item: isAgedBrie,
    rules: [
      {
        predicate: item => !isExpired(item),
        updates: {
          quality: updateQuality(1),
          sellIn: updateSellIn(-1),
        },
      },
      {
        predicate: isExpired,
        updates: {
          quality: updateQuality(2),
          sellIn: updateSellIn(-1),
        },
      },
    ]
  },
  {
    item: isLegendary,
    rules: [
      {
        updates: {
          quality: updateQuality(0),
          sellIn: updateQuality(0),
        },
      }
    ]
  },
  {
    item: isConjured,
    rules: [
      {
        predicate: item => !isExpired(item),
        updates: {
          quality: updateQuality(-2),
          sellIn: updateSellIn(-1),
        },
      },
      {
        predicate: isExpired,
        updates: {
          quality: updateQuality(-4),
          sellIn: updateSellIn(-1),
        }
      },
    ]
  },
  {
    item: isBackstagePasses,
    rules: [
      {
        predicate: isExpired,
        updates: {
          quality: item => (item.quality = 0, item),
          sellIn: updateSellIn(-1),
        },
      },
      {
        predicate: backstagePassesPredicates.isLimited,
        updates: {
          quality: updateQuality(3),
          sellIn: updateSellIn(-1),
        }
      },
      {
        predicate: backstagePassesPredicates.isFresh,
        updates: {
          quality: updateQuality(2),
          sellIn: updateSellIn(-1),
        }
      },
      {
        predicate: backstagePassesPredicates.isEarlyBird,
        updates: {
          quality: updateQuality(1),
          sellIn: updateSellIn(-1),
        }
      },
    ]
  },
]

const updateShopItems = items => {
  return items.map(item => {
    const currentItemRules = itemRules(item, rules)
    const currentRule = itemRule(item, currentItemRules)

    return update(currentRule.updates)(item)
  })
}

class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() { return updateShopItems(this.items) }
}
