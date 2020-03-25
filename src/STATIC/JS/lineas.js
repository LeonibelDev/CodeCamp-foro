new Morris.Line({
  element: document.querySelectorAll('#graphic')[0],

   data: [
    { year: '2008', value: 20, data_2: 10 },
    { year: '2009', value: 10, data_2: 14 },
    { year: '2010', value: 5, data_2: 3, data_3: 12 },
    { year: '2011', value: 5, data_3: 4 },
    {year: '2012',            data_3: 8}
    // { year: '2012', value: 20 }
  ],
  // The name of the data record attribute that contains x-values.
  xkey: 'year',
  // A list of names of data record attributes that contain y-values.
  ykeys: ['value', 'data_2', 'data_3'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['INFMTCS', "DATAS", "ATM"],
  resize: false, 
  pointSize: 3,
  lineWidth: 1

});