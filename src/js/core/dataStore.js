﻿export default {
   name: 'DataStore',
   debug: false,
   state: {
      appVersion: '1.0',
      tasks: [
         { name: 'Sprwadź punkt numer 1', time: '18:00:00' },
         { name: 'Sprwadź punkt numer 2', time: '18:05:00' },
         { name: 'Sprwadź punkt numer 3', time: '18:10:00' }
      ],
      reportNumber: '797026001',
      currentUser: 'Albert Kozak',
      bgTaskActive: false,
      bgTaskHandler: null
   }
}