(function(root){'use strict';
const groups=[
  {
    "id": "primary",
    "en": "Primary heirs · Immediate family",
    "bn": "প্রাথমিক উত্তরাধিকারী · নিকটতম পরিবার",
    "open": true,
    "items": [
      [
        "father",
        "Father",
        "পিতা",
        1
      ],
      [
        "husband",
        "Husband",
        "স্বামী",
        1
      ],
      [
        "wives",
        "Wife / wives",
        "স্ত্রী",
        4
      ],
      [
        "mother",
        "Mother",
        "মাতা",
        1
      ],
      [
        "daughter",
        "Daughter",
        "কন্যা",
        99
      ],
      [
        "son",
        "Son",
        "পুত্র",
        99
      ]
    ]
  },
  {
    "id": "ascendants",
    "en": "Grandparents & great-grandparents",
    "bn": "দাদা–দাদি, নানা–নানি ও ঊর্ধ্বতন",
    "items": [
      [
        "pgf",
        "Father’s father",
        "পিতার পিতা",
        1
      ],
      [
        "pggf",
        "Father’s father’s father",
        "পিতার পিতার পিতা",
        1
      ],
      [
        "pgm",
        "Father’s mother",
        "পিতার মাতা",
        1
      ],
      [
        "mgm",
        "Mother’s mother",
        "মাতার মাতা",
        1
      ],
      [
        "ffm",
        "Father’s father’s mother",
        "পিতার পিতার মাতা",
        1
      ],
      [
        "fmm",
        "Father’s mother’s mother",
        "পিতার মাতার মাতা",
        1
      ],
      [
        "mmm",
        "Mother’s mother’s mother",
        "মাতার মাতার মাতা",
        1
      ]
    ]
  },
  {
    "id": "descendants",
    "en": "Other primary heirs · Grandchildren & siblings",
    "bn": "অন্য প্রাথমিক উত্তরাধিকারী · নাতি-নাতনি ও ভাইবোন",
    "items": [
      [
        "ss",
        "Son’s son",
        "পুত্রের পুত্র",
        99
      ],
      [
        "sd",
        "Son’s daughter",
        "পুত্রের কন্যা",
        99
      ],
      [
        "sss",
        "Son’s son’s son",
        "পুত্রের পুত্রের পুত্র",
        99
      ],
      [
        "ssd",
        "Son’s son’s daughter",
        "পুত্রের পুত্রের কন্যা",
        99
      ],
      [
        "fb",
        "Full brother",
        "সহোদর ভাই",
        99
      ],
      [
        "fs",
        "Full sister",
        "সহোদরা বোন",
        99
      ],
      [
        "ms",
        "Maternal half-sibling (brother or sister)",
        "একই মাতার বৈপিত্রেয় ভাই বা বোন",
        99
      ],
      [
        "pb",
        "Paternal half-brother",
        "একই পিতার বৈমাত্রেয় ভাই",
        99
      ],
      [
        "ps",
        "Paternal half-sister",
        "একই পিতার বৈমাত্রেয় বোন",
        99
      ]
    ]
  },
  {
    "id": "residuaries",
    "en": "Further male residuaries",
    "bn": "আরও দূরবর্তী আসাবা",
    "items": [
      [
        "fbs",
        "Full brother’s son",
        "সহোদর ভাইয়ের পুত্র",
        99
      ],
      [
        "pbs",
        "Paternal half-brother’s son",
        "বৈমাত্রেয় ভাইয়ের পুত্র",
        99
      ],
      [
        "fbss",
        "Full brother’s son’s son",
        "সহোদর ভাইয়ের পুত্রের পুত্র",
        99
      ],
      [
        "pbss",
        "Paternal half-brother’s son’s son",
        "বৈমাত্রেয় ভাইয়ের পুত্রের পুত্র",
        99
      ],
      [
        "fu",
        "Father’s full brother",
        "পিতার সহোদর ভাই",
        99
      ],
      [
        "pu",
        "Father’s paternal half-brother",
        "পিতার বৈমাত্রেয় ভাই",
        99
      ],
      [
        "fus",
        "Father’s full brother’s son",
        "পিতার সহোদর ভাইয়ের পুত্র",
        99
      ],
      [
        "pus",
        "Father’s paternal half-brother’s son",
        "পিতার বৈমাত্রেয় ভাইয়ের পুত্র",
        99
      ],
      [
        "fuss",
        "Father’s full brother’s son’s son",
        "পিতার সহোদর ভাইয়ের পুত্রের পুত্র",
        99
      ],
      [
        "puss",
        "Father’s paternal half-brother’s son’s son",
        "পিতার বৈমাত্রেয় ভাইয়ের পুত্রের পুত্র",
        99
      ]
    ]
  },
  {
    "id": "distant1",
    "en": "Distant kindred · Descendants",
    "bn": "জবিল আরহাম · বংশধর",
    "items": [
      [
        "ds",
        "Daughter’s son",
        "কন্যার পুত্র",
        99
      ],
      [
        "dd",
        "Daughter’s daughter",
        "কন্যার কন্যা",
        99
      ],
      [
        "sds",
        "Son’s daughter’s son",
        "পুত্রের কন্যার পুত্র",
        99
      ],
      [
        "sdd",
        "Son’s daughter’s daughter",
        "পুত্রের কন্যার কন্যা",
        99
      ],
      [
        "dss",
        "Daughter’s son’s son",
        "কন্যার পুত্রের পুত্র",
        99
      ],
      [
        "dsd",
        "Daughter’s son’s daughter",
        "কন্যার পুত্রের কন্যা",
        99
      ],
      [
        "dds",
        "Daughter’s daughter’s son",
        "কন্যার কন্যার পুত্র",
        99
      ],
      [
        "ddd",
        "Daughter’s daughter’s daughter",
        "কন্যার কন্যার কন্যা",
        99
      ],
      [
        "ssds",
        "Son’s son’s daughter’s son",
        "পুত্রের পুত্রের কন্যার পুত্র",
        99
      ],
      [
        "ssdd",
        "Son’s son’s daughter’s daughter",
        "পুত্রের পুত্রের কন্যার কন্যা",
        99
      ]
    ]
  },
  {
    "id": "distant2",
    "en": "Distant kindred · Ascendants",
    "bn": "জবিল আরহাম · ঊর্ধ্বতন",
    "items": [
      [
        "mf",
        "Mother’s father",
        "মাতার পিতা",
        1
      ],
      [
        "fmf",
        "Father’s mother’s father",
        "পিতার মাতার পিতা",
        1
      ],
      [
        "mff",
        "Mother’s father’s father",
        "মাতার পিতার পিতা",
        1
      ],
      [
        "mmf",
        "Mother’s mother’s father",
        "মাতার মাতার পিতা",
        1
      ],
      [
        "mfm",
        "Mother’s father’s mother",
        "মাতার পিতার মাতা",
        1
      ]
    ]
  },
  {
    "id": "distant3",
    "en": "Distant kindred · Siblings’ descendants",
    "bn": "জবিল আরহাম · ভাইবোনের বংশধর",
    "items": [
      [
        "fbd",
        "Full brother’s daughter",
        "সহোদর ভাইয়ের কন্যা",
        99
      ],
      [
        "fss",
        "Full sister’s son",
        "সহোদরা বোনের পুত্র",
        99
      ],
      [
        "fsd",
        "Full sister’s daughter",
        "সহোদরা বোনের কন্যা",
        99
      ],
      [
        "mbs",
        "Maternal half-brother’s son",
        "বৈপিত্রেয় ভাইয়ের পুত্র",
        99
      ],
      [
        "mbd",
        "Maternal half-brother’s daughter",
        "বৈপিত্রেয় ভাইয়ের কন্যা",
        99
      ],
      [
        "mss",
        "Maternal half-sister’s son",
        "বৈপিত্রেয় বোনের পুত্র",
        99
      ],
      [
        "msd",
        "Maternal half-sister’s daughter",
        "বৈপিত্রেয় বোনের কন্যা",
        99
      ],
      [
        "pbd",
        "Paternal half-brother’s daughter",
        "বৈমাত্রেয় ভাইয়ের কন্যা",
        99
      ],
      [
        "pss",
        "Paternal half-sister’s son",
        "বৈমাত্রেয় বোনের পুত্র",
        99
      ],
      [
        "psd",
        "Paternal half-sister’s daughter",
        "বৈমাত্রেয় বোনের কন্যা",
        99
      ]
    ]
  },
  {
    "id": "distant4p",
    "en": "Distant kindred · Father’s family",
    "bn": "জবিল আরহাম · পিতার পরিবার",
    "items": [
      [
        "fa",
        "Father’s full sister",
        "পিতার সহোদরা বোন",
        99
      ],
      [
        "fpa",
        "Father’s paternal half-sister",
        "পিতার বৈমাত্রেয় বোন",
        99
      ],
      [
        "fma",
        "Father’s maternal half-sister",
        "পিতার বৈপিত্রেয় বোন",
        99
      ],
      [
        "fmu",
        "Father’s maternal half-brother",
        "পিতার বৈপিত্রেয় ভাই",
        99
      ]
    ]
  },
  {
    "id": "distant4m",
    "en": "Distant kindred · Mother’s family",
    "bn": "জবিল আরহাম · মাতার পরিবার",
    "items": [
      [
        "mu",
        "Mother’s full brother",
        "মাতার সহোদর ভাই",
        99
      ],
      [
        "ma",
        "Mother’s full sister",
        "মাতার সহোদরা বোন",
        99
      ],
      [
        "mpu",
        "Mother’s paternal half-brother",
        "মাতার বৈমাত্রেয় ভাই",
        99
      ],
      [
        "mpa",
        "Mother’s paternal half-sister",
        "মাতার বৈমাত্রেয় বোন",
        99
      ],
      [
        "mmu",
        "Mother’s maternal half-brother",
        "মাতার বৈপিত্রেয় ভাই",
        99
      ],
      [
        "mma",
        "Mother’s maternal half-sister",
        "মাতার বৈপিত্রেয় বোন",
        99
      ]
    ]
  }
];
if(typeof module!=='undefined'&&module.exports)module.exports=groups;else root.HeirGroups=groups;
})(typeof globalThis==='undefined'?this:globalThis);
