// components/continents.js

// ===== أوروبا (44 دولة) =====
const europeLevel1 = [
  { name: 'فرنسا', lat: 46, lng: 2, fact: 'باريس' },
  { name: 'ألمانيا', lat: 51, lng: 10, fact: 'برلين' },
  { name: 'إيطاليا', lat: 42, lng: 12, fact: 'روما' },
  { name: 'إسبانيا', lat: 40, lng: -4, fact: 'مدريد' },
  { name: 'بريطانيا', lat: 54, lng: -2, fact: 'لندن' },
  { name: 'بولندا', lat: 52, lng: 19, fact: 'وارسو' },
  { name: 'رومانيا', lat: 46, lng: 25, fact: 'بوخارست' },
  { name: 'هولندا', lat: 52, lng: 5, fact: 'أمستردام' },
  { name: 'بلجيكا', lat: 50, lng: 4, fact: 'بروكسل' },
  { name: 'اليونان', lat: 39, lng: 22, fact: 'أثينا' },
  { name: 'البرتغال', lat: 39, lng: -8, fact: 'لشبونة' }
];

const europeLevel2 = [
  { name: 'التشيك', lat: 49, lng: 15, fact: 'براغ' },
  { name: 'المجر', lat: 47, lng: 19, fact: 'بودابست' },
  { name: 'السويد', lat: 62, lng: 15, fact: 'ستوكهولم' },
  { name: 'النمسا', lat: 47, lng: 13, fact: 'فيينا' },
  { name: 'صربيا', lat: 44, lng: 21, fact: 'بلغراد' },
  { name: 'بلغاريا', lat: 43, lng: 25, fact: 'صوفيا' },
  { name: 'الدنمارك', lat: 56, lng: 10, fact: 'كوبنهاغن' },
  { name: 'فنلندا', lat: 64, lng: 26, fact: 'هلسنكي' },
  { name: 'سلوفاكيا', lat: 48, lng: 19, fact: 'براتيسلافا' },
  { name: 'النرويج', lat: 60, lng: 8, fact: 'أوسلو' },
  { name: 'أيرلندا', lat: 53, lng: -8, fact: 'دبلن' }
];

const europeLevel3 = [
  { name: 'كرواتيا', lat: 45, lng: 16, fact: 'زغرب' },
  { name: 'سويسرا', lat: 47, lng: 8, fact: 'برن' },
  { name: 'ليتوانيا', lat: 56, lng: 24, fact: 'فيلنيوس' },
  { name: 'سلوفينيا', lat: 46, lng: 15, fact: 'ليوبليانا' },
  { name: 'لاتفيا', lat: 57, lng: 25, fact: 'ريغا' },
  { name: 'إستونيا', lat: 59, lng: 26, fact: 'تالين' },
  { name: 'مقدونيا الشمالية', lat: 41, lng: 22, fact: 'سكوبيه' },
  { name: 'ألبانيا', lat: 41, lng: 20, fact: 'تيرانا' },
  { name: 'البوسنة والهرسك', lat: 44, lng: 18, fact: 'سراييفو' },
  { name: 'مولدوفا', lat: 47, lng: 29, fact: 'كيشيناو' },
  { name: 'بيلاروسيا', lat: 53, lng: 28, fact: 'مينسك' }
];

const europeLevel4 = [
  { name: 'أوكرانيا', lat: 49, lng: 32, fact: 'كييف' },
  { name: 'كوسوفو', lat: 42, lng: 21, fact: 'بريشتينا' },
  { name: 'لوكسمبورغ', lat: 49, lng: 6, fact: 'لوكسمبورغ' },
  { name: 'الجبل الأسود', lat: 42, lng: 19, fact: 'بودغوريتسا' },
  { name: 'مالطا', lat: 36, lng: 14, fact: 'فاليتا' },
  { name: 'أيسلندا', lat: 65, lng: -18, fact: 'ريكيافيك' },
  { name: 'أندورا', lat: 42, lng: 1, fact: 'أندورا لا فيلا' },
  { name: 'موناكو', lat: 43, lng: 7, fact: 'موناكو' },
  { name: 'ليختنشتاين', lat: 47, lng: 9, fact: 'فادوز' },
  { name: 'سان مارينو', lat: 43, lng: 12, fact: 'سان مارينو' },
  { name: 'الفاتيكان', lat: 41, lng: 12, fact: 'الفاتيكان' }
];

// ===== أفريقيا (54 دولة) =====
const africaLevel1 = [
  { name: 'مصر', lat: 26, lng: 30, fact: 'القاهرة' },
  { name: 'الجزائر', lat: 28, lng: 3, fact: 'الجزائر' },
  { name: 'المغرب', lat: 32, lng: -6, fact: 'الرباط' },
  { name: 'تونس', lat: 34, lng: 9, fact: 'تونس' },
  { name: 'ليبيا', lat: 27, lng: 17, fact: 'طرابلس' },
  { name: 'السودان', lat: 15, lng: 30, fact: 'الخرطوم' },
  { name: 'جنوب أفريقيا', lat: -29, lng: 24, fact: 'بريتوريا' },
  { name: 'نيجيريا', lat: 9, lng: 8, fact: 'أبوجا' },
  { name: 'إثيوبيا', lat: 9, lng: 40, fact: 'أديس أبابا' },
  { name: 'كينيا', lat: -1, lng: 38, fact: 'نيروبي' },
  { name: 'غانا', lat: 8, lng: -1, fact: 'أكرا' }
];

const africaLevel2 = [
  { name: 'تنزانيا', lat: -6, lng: 35, fact: 'دودوما' },
  { name: 'أوغندا', lat: 1, lng: 32, fact: 'كمبالا' },
  { name: 'الكاميرون', lat: 6, lng: 12, fact: 'ياوندي' },
  { name: 'ساحل العاج', lat: 8, lng: -5, fact: 'ياموسوكرو' },
  { name: 'السنغال', lat: 14, lng: -14, fact: 'داكار' },
  { name: 'أنغولا', lat: -12, lng: 18, fact: 'لواندا' },
  { name: 'موزمبيق', lat: -18, lng: 35, fact: 'مابوتو' },
  { name: 'مدغشقر', lat: -19, lng: 46, fact: 'أنتاناناريفو' },
  { name: 'زامبيا', lat: -15, lng: 30, fact: 'لوساكا' },
  { name: 'زيمبابوي', lat: -19, lng: 30, fact: 'هراري' },
  { name: 'مالي', lat: 17, lng: -4, fact: 'باماكو' }
];

const africaLevel3 = [
  { name: 'النيجر', lat: 16, lng: 8, fact: 'نيامي' },
  { name: 'بوركينا فاسو', lat: 13, lng: -2, fact: 'واغادوغو' },
  { name: 'الصومال', lat: 5, lng: 46, fact: 'مقديشو' },
  { name: 'رواندا', lat: -2, lng: 30, fact: 'كيغالي' },
  { name: 'بوروندي', lat: -3, lng: 30, fact: 'بوجومبورا' },
  { name: 'بنين', lat: 9, lng: 2, fact: 'بورتو نوفو' },
  { name: 'توغو', lat: 8, lng: 1, fact: 'لومي' },
  { name: 'ليبيريا', lat: 6, lng: -9, fact: 'مونروفيا' },
  { name: 'سيراليون', lat: 8, lng: -12, fact: 'فريتاون' },
  { name: 'غينيا', lat: 11, lng: -10, fact: 'كوناكري' },
  { name: 'مالاوي', lat: -13, lng: 34, fact: 'ليلونغوي' }
];

const africaLevel4 = [
  { name: 'موريتانيا', lat: 20, lng: -10, fact: 'نواكشوط' },
  { name: 'تشاد', lat: 15, lng: 19, fact: 'نجامينا' },
  { name: 'جمهورية أفريقيا الوسطى', lat: 7, lng: 21, fact: 'بانغي' },
  { name: 'الكونغو الديمقراطية', lat: -4, lng: 22, fact: 'كينشاسا' },
  { name: 'الكونغو', lat: -1, lng: 15, fact: 'برازافيل' },
  { name: 'الغابون', lat: -1, lng: 11, fact: 'ليبرفيل' },
  { name: 'غينيا الاستوائية', lat: 2, lng: 10, fact: 'مالابو' },
  { name: 'بوتسوانا', lat: -22, lng: 24, fact: 'غابورون' },
  { name: 'ناميبيا', lat: -22, lng: 17, fact: 'ويندهوك' },
  { name: 'ليسوتو', lat: -29, lng: 28, fact: 'ماسيرو' },
  { name: 'إسواتيني', lat: -26, lng: 31, fact: 'مبابان' }
];

const africaLevel5 = [
  { name: 'إريتريا', lat: 15, lng: 39, fact: 'أسمرة' },
  { name: 'جيبوتي', lat: 11, lng: 43, fact: 'جيبوتي' },
  { name: 'غامبيا', lat: 13, lng: -15, fact: 'بانجول' },
  { name: 'غينيا بيساو', lat: 12, lng: -15, fact: 'بيساو' },
  { name: 'جزر القمر', lat: -12, lng: 44, fact: 'موروني' },
  { name: 'الرأس الأخضر', lat: 16, lng: -24, fact: 'برايا' },
  { name: 'ساو تومي وبرينسيب', lat: 1, lng: 7, fact: 'ساو تومي' },
  { name: 'سيشل', lat: -5, lng: 55, fact: 'فيكتوريا' },
  { name: 'موريشيوس', lat: -20, lng: 57, fact: 'بورت لويس' },
  { name: 'جنوب السودان', lat: 7, lng: 30, fact: 'جوبا' }
];

// ===== تصدير البيانات =====
export const continentsData = {
  europe: {
    name: 'أوروبا',
    emoji: '',
    totalCountries: 44,
    levels: [europeLevel1, europeLevel2, europeLevel3, europeLevel4],
    allCountries: [...europeLevel1, ...europeLevel2, ...europeLevel3, ...europeLevel4]
  },
  africa: {
    name: 'أفريقيا',
    emoji: '',
    totalCountries: 54,
    levels: [africaLevel1, africaLevel2, africaLevel3, africaLevel4, africaLevel5],
    allCountries: [...africaLevel1, ...africaLevel2, ...africaLevel3, ...africaLevel4, ...africaLevel5]
  }
};