const brieName = 'Aged Brie'
const conjuredName = 'Conjured Mana Cake'
const sulfurasName = 'Sulfuras, Hand of Ragnaros'
const backstagePassesName = 'Backstage passes to a TAFKAL80ETC concert'
const miscItemName = 'Elixir of the Mongoose'
const miscItem2Name = '+5 Dexterity Vest'

const freshBrie = new Item(brieName, 10, 10)
const expiredBrie = new Item(brieName, 0, 10)
const freshConjured = new Item(conjuredName, 10, 10)
const expiredConjured = new Item(conjuredName, 0, 10)
const freshSulfuras = new Item(sulfurasName, 10, 80)
const expiredSulfuras = new Item(sulfurasName, 0, 80)
const earlyBirdBackstagePasses = new Item(backstagePassesName, 12, 10)
const freshBackstagePasses = new Item(backstagePassesName, 10, 10)
const limitedBackstagePasses = new Item(backstagePassesName, 3, 10)
const expiredBackstagePasses = new Item(backstagePassesName, 0, 10)
const freshMiscItem = new Item(miscItemName, 10, 10)
const expiredMiscItem = new Item(miscItemName, 0, 10)

describe("Gilded Rose", function() {
  describe('By default', function() {
    describe('when sellIn date is >= 0', function() {
      const gildedRose = new Shop([freshMiscItem]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('decreases the quality by 1', function() {
        expect(item.sellIn).toEqual(9);
        expect(item.quality).toEqual(9);
      })
    })

    describe('when sellIn date is < 0', function() {
      const gildedRose = new Shop([expiredMiscItem]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('decreases the quality by 2', function() {
        expect(item.sellIn).toEqual(-1);
        expect(item.quality).toEqual(8);
      })
    })

    describe('when quality is already set to 0', function() {
      const poorQualityItem = new Item('Poor item', 10, 0)
      const gildedRose = new Shop([poorQualityItem]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('lets the quality to 0', function() {
        expect(item.sellIn).toEqual(9)
        expect(item.quality).toEqual(0)
      })
    })
  })

  describe('For Aged Brie', function() {
    describe('when sellIn date is >= 0', function() {
      const gildedRose = new Shop([freshBrie]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('increases the quality by 1', function() {
        expect(item.sellIn).toEqual(9);
        expect(item.quality).toEqual(11);
      })
    })

    describe('when sellIn date is < 0', function() {
      const gildedRose = new Shop([expiredBrie]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('increases the quality by 1', function() {
        expect(item.sellIn).toEqual(-1);
        expect(item.quality).toEqual(12);
      })
    })

    describe('when quality is already set to 50', function() {
      const oldAgedBrie = new Item('Aged Brie oooold', 10, 50)
      const gildedRose = new Shop([oldAgedBrie]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('lets the quality to 0', function() {
        expect(item.sellIn).toEqual(9)
        expect(item.quality).toEqual(50)
      })
    })
  })

  describe('For Sulfuras', function() {
    describe('when sellIn date is >= 0', function() {
      const gildedRose = new Shop([freshSulfuras]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('lets the quality to 80', function() {
        expect(item.sellIn).toEqual(10);
        expect(item.quality).toEqual(80);
      })
    })

    describe('when sellIn date is < 0', function() {
      const gildedRose = new Shop([expiredSulfuras]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('lets the quality to 80', function() {
        expect(item.sellIn).toEqual(0);
        expect(item.quality).toEqual(80);
      })
    })
  })

  describe('For Backstage Passes', function() {
    describe('when sellIn date is < 0', function() {
      const gildedRose = new Shop([expiredBackstagePasses]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('set the quality to 0', function() {
        expect(item.sellIn).toEqual(-1);
        expect(item.quality).toEqual(0);
      })
    })

    describe('when sellin date is <= 3', function() {
      const gildedRose = new Shop([limitedBackstagePasses]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('increases the quality by 3', function() {
        expect(item.sellIn).toEqual(2);
        expect(item.quality).toEqual(13);
      })
    })

    describe('when sellIn date is <= 10', function() {
      const gildedRose = new Shop([freshBackstagePasses]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('increases the quality by 2', function() {
        expect(item.sellIn).toEqual(9);
        expect(item.quality).toEqual(12);
      })
    })

    describe('when sellIn date is > 10', function() {
      const gildedRose = new Shop([earlyBirdBackstagePasses]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('increases the quality by 2', function() {
        expect(item.sellIn).toEqual(11);
        expect(item.quality).toEqual(11);
      })
    })

    describe('when quality is already set to 50', function() {
      const awesomeBackstagePasses = new Item(
        'Backstage passes Celine Dion',
        10,
        50
      )
      const gildedRose = new Shop([awesomeBackstagePasses]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('lets the quality to 0', function() {
        expect(item.sellIn).toEqual(9)
        expect(item.quality).toEqual(50)
      })
    })
  })

  describe('For Conjured item', function() {
    describe('when sellIn date is >= 0', function() {
      const gildedRose = new Shop([freshConjured]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('decreases the quality by 2', function() {
        expect(item.sellIn).toEqual(9);
        expect(item.quality).toEqual(8);
      })
    })

    describe('when sellIn date is < 0', function() {
      const gildedRose = new Shop([expiredConjured]);
      const items = gildedRose.updateQuality();
      const item = items[0]

      it('decreases the quality by 2', function() {
        expect(item.sellIn).toEqual(-1);
        expect(item.quality).toEqual(6);
      })
    })
  })
});
