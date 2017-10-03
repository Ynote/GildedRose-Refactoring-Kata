// Each rule should be exclusive, so we pick the first matching one.
const itemRules = (item, rules) => (
  rules.filter(rule => rule.item(item))[0].rules
)

const itemRule = (item, rules) => {
  return rules.filter(rule => {
    if (!rule.predicate) return true

    return rule.predicate(item)
  })[0]
}

// Items rules
const isConjured = item => item.name.match(/^Conjured/)
const isBackstagePasses = item => item.name.match(/^Backstage passes/)
const isLegendary = item => item.name.match(/^Sulfuras/)
const isAgedBrie = item => item.name.match(/^Aged Brie/)
const isBasic = item => {
  return !isConjured(item) &&
    !isBackstagePasses(item) &&
    !isLegendary(item) &&
    !isAgedBrie(item)
}

// Items rules predicates
const isExpired = item => item.sellIn <= 0
const backstagePassesPredicates = {
  isEarlyBird: item => item.sellIn > 10,
  isLimited: item => item.sellIn > 0 && item.sellIn <= 3,
  isFresh: item => {
    if (backstagePassesPredicates.isLimited(item)) return false

    return item.sellIn > 0 && item.sellIn <= 10
  },
}

// Updates methods
const updateSellIn = sellIn => item => (item.sellIn += sellIn, item)
const canUpdateQuality = currentQuality => (
  currentQuality > 0 && currentQuality < 50
)
const updateQuality = quality => item => {
  if (!canUpdateQuality(item.quality)) return item

  return (item.quality += quality, item)
}

// Update strategy
const _pipe = (f, g) => (...args) => g(f(...args))
const pipe = (...fns) => fns.reduce(_pipe)
const update = options => item => pipe.apply(this,options)(item)

const rules = [
  {
    item: isBasic,
    rules: [
      {
        predicate: item => !isExpired(item),
        updates: [
          updateQuality(-1),
          updateSellIn(-1),
        ],
      },
      {
        predicate: isExpired,
        updates: [
          updateQuality(-2),
          updateSellIn(-1),
        ],
      },
    ],
  },
  {
    item: isAgedBrie,
    rules: [
      {
        predicate: item => !isExpired(item),
        updates: [
          updateQuality(1),
          updateSellIn(-1),
        ],
      },
      {
        predicate: isExpired,
        updates: [
          updateQuality(2),
          updateSellIn(-1),
        ],
      },
    ]
  },
  {
    item: isLegendary,
    rules: [
      {
        updates: [
          updateQuality(0),
          updateQuality(0),
        ],
      }
    ]
  },
  {
    item: isConjured,
    rules: [
      {
        predicate: item => !isExpired(item),
        updates: [
          updateQuality(-2),
          updateSellIn(-1),
        ],
      },
      {
        predicate: isExpired,
        updates: [
          updateQuality(-4),
          updateSellIn(-1),
        ],
      },
    ]
  },
  {
    item: isBackstagePasses,
    rules: [
      {
        predicate: isExpired,
        updates: [
          item => (item.quality = 0, item),
          updateSellIn(-1),
        ],
      },
      {
        predicate: backstagePassesPredicates.isLimited,
        updates: [
          updateQuality(3),
          updateSellIn(-1),
        ],
      },
      {
        predicate: backstagePassesPredicates.isFresh,
        updates: [
          updateQuality(2),
          updateSellIn(-1),
        ],
      },
      {
        predicate: backstagePassesPredicates.isEarlyBird,
        updates: [
          updateQuality(1),
          updateSellIn(-1),
        ],
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
