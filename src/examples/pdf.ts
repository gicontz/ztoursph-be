const example1 = {
  value: {
    content: {
      referenceNumber: 'ABC123',
      firstName: 'John',
      middleInitial: 'D',
      lastName: 'Doe',
      suffix: 'Jr',
      birthday: '1990-01-01',
      nationality: 'US',
      email: 'john.doe@example.com',
      mobileNumber1: '1234567890',
      mobileNumber2: '0987654321',
      booking_date: '2024-04-17',
      guests: {
        1: [
          { id: '1', name: 'Guest 1', age: 25, nationality: 'US' },
          { id: '2', name: 'Guest 2', age: 30, nationality: 'UK' },
        ],
        7: [{ id: '3', name: 'Guest 3', age: 40, nationality: 'CA' }],
      },
      booked_tours: [
        {
          id: 1,
          category: 'tours',
          pax: 2,
          date: '2024-04-20',
          pickup_time: '10:00 AM',
          title: 'City Tour',
          subtotal: '$100',
        },
        {
          id: 7,
          category: 'tours',
          pax: 1,
          date: '2024-04-22',
          pickup_time: '9:00 AM',
          title: 'Adventure Package',
          subtotal: '$200',
        },
      ],
    },
  },
};

export { example1 };
