class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const isConjured = function(item) {
  return item.name.match(/^Conjured/)
}

const isBackstagePasses = function(item) {
  return item.name.match(/^Backstage passes/)
}

const isLegendary = function(item) {
  return item.name.match(/^Sulfuras/)
}

const isAgedBrie = function (item) {
  return item.name.match(/^Aged Brie/)
}

const isExpired = function(item) {
  return item.sellIn <= 0
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

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() {
    return this.items.map(item => {
      if (isConjured(item)) {
        const options = {
          quality: isExpired(item) ? -4 : -2,
          sellIn: -1,
        }

        return update(item, options)
      }

      if (isAgedBrie(item)) {
        const options = {
          quality : isExpired(item) ? 2 : 1,
          sellIn : -1,
        }

        return update(item, options)
      }

      if (isLegendary(item)) { return item }

      if (isBackstagePasses(item)) {
        let qualityDelta

        if (item.sellIn <= 0) {
          qualityDelta = -item.quality
        } else if (item.sellIn <= 3) {
          qualityDelta = 3
        } else if (item.sellIn <= 10) {
          qualityDelta = 2
        } else {
          qualityDelta = 1
        }

        return update(item, {
          sellIn: -1,
          quality: qualityDelta,
        })
      }

      const options = {
        quality: isExpired(item) ? -2 : -1,
        sellIn: -1,
      }

      return update(item, options)
    })
  }
}
