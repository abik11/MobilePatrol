export default {
   name: 'DataStore',
   debug: false,
   state: {
      appVersion: '1.0',
      settingsPassword: '',
      dailyTasks: [
         //{ name: 'Sprwadź punkt numer 1', time: new Date(1, 1, 1, 18, 0, 0), id: 1, status: 'undone' },
         //{ name: 'Sprwadź punkt numer 2', time: new Date(1, 1, 1, 18, 5, 0), id: 2, status: 'undone' },
         //{ name: 'Sprwadź punkt numer 3', time: new Date(1, 1, 1, 18, 15, 0), id: 3, status: 'undone' }
         { name: 'Sprwadź punkt numer 1', time: '18:00', id: 1, status: 'undone' },
         { name: 'Sprwadź punkt numer 2', time: '18:05', id: 2, status: 'undone' },
         { name: 'Sprwadź punkt numer 3', time: '18:15', id: 3, status: 'undone' }
      ],
      reportNumber: '',
      currentUser: '',
      bgTaskActive: false,
      bgTaskHandler: null
   }
}