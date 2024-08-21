'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('sector', [
      {
        id: crypto.randomUUID(),
        value: 'Hospitality',
      },
      {
        id: crypto.randomUUID(),
        value: 'Construction',
      },
    ]);

    await queryInterface.bulkInsert('hospitality_role', [
      {
        id: crypto.randomUUID(),
        value: 'Waiter / Head Waiter',
        group: 'Front of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Bartender',
        group: 'Front of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Barista',
        group: 'Front of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Receptionist / Maitre d’ / Host',
        group: 'Front of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Concierge',
        group: 'Front of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Commis Chef',
        group: 'Back of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Sous Chef',
        group: 'Back of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Head Chef',
        group: 'Back of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Barback',
        group: 'Back of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Runner',
        group: 'Back of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Porter',
        group: 'Back of House',
      },
      {
        id: crypto.randomUUID(),
        value: 'Team Leader / Supervisor',
        group: 'Management',
      },
      {
        id: crypto.randomUUID(),
        value: 'General Manager',
        group: 'Management',
      },
      {
        id: crypto.randomUUID(),
        value: 'Restaurant Manager',
        group: 'Management',
      },
      {
        id: crypto.randomUUID(),
        value: 'Assistant Manager',
        group: 'Management',
      },
      {
        id: crypto.randomUUID(),
        value: 'SIA Security',
        group: 'Other',
      },
      {
        id: crypto.randomUUID(),
        value: 'Events / Venue / Catering Roles',
        group: 'Other',
      },
      {
        id: crypto.randomUUID(),
        value: 'Crew Member (Fast Food)',
        group: 'Other',
      },
      {
        id: crypto.randomUUID(),
        value: 'Cleaner',
        group: 'Other',
      },
    ]);

    await queryInterface.bulkInsert('hospitality_establishment', [
      {
        id: crypto.randomUUID(),
        value: 'Pub / Bar / Restaurant',
      },
      {
        id: crypto.randomUUID(),
        value: 'Luxury Hotel / Fine Dining',
      },
      {
        id: crypto.randomUUID(),
        value: 'Affordable Hotel',
      },
      {
        id: crypto.randomUUID(),
        value: 'Coffee Shop / Fast Food / Cafe',
      },
      {
        id: crypto.randomUUID(),
        value: 'Nightclubs, Events & Venues',
      },
    ]);

    await queryInterface.bulkInsert('construction_role', [
      {
        id: crypto.randomUUID(),
        value: 'General Labour',
      },
      {
        id: crypto.randomUUID(),
        value: 'Banksman / Traffic Marshall',
      },
      {
        id: crypto.randomUUID(),
        value: 'Telehandler',
      },
      {
        id: crypto.randomUUID(),
        value: 'Hod Carrier',
      },
      {
        id: crypto.randomUUID(),
        value: 'Bricklayer',
      },
      {
        id: crypto.randomUUID(),
        value: 'Carpenter',
      },
      {
        id: crypto.randomUUID(),
        value: 'Groundworker',
      },
      {
        id: crypto.randomUUID(),
        value: 'Machine Driver',
      },
    ]);

    await queryInterface.bulkInsert('construction_card_type', [
      {
        id: crypto.randomUUID(),
        value: 'Green Card',
      },
      {
        id: crypto.randomUUID(),
        value: 'Blue Card',
      },
      {
        id: crypto.randomUUID(),
        value: 'Gold Card',
      },
      {
        id: crypto.randomUUID(),
        value: 'Black Card',
      },
    ]);

    await queryInterface.bulkInsert('years_experience', [
      {
        id: crypto.randomUUID(),
        value: 'Up to 1 year',
      },
      {
        id: crypto.randomUUID(),
        value: '1-2 years',
      },
      {
        id: crypto.randomUUID(),
        value: '3-5 years',
      },
      {
        id: crypto.randomUUID(),
        value: '5+ years',
      },
    ]);

    await queryInterface.bulkInsert('daily_job_update', [
      {
        id: crypto.randomUUID(),
        value: 'All The Jobs',
      },
      {
        id: crypto.randomUUID(),
        value: 'Couple Of Jobs Per Day',
      },
      {
        id: crypto.randomUUID(),
        value: 'A Few Jobs Per Week',
      },
      {
        id: crypto.randomUUID(),
        value: 'Once A Week',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('hospitality_role', null, {});
    await queryInterface.bulkDelete('hospitality_establishment', null, {});
    await queryInterface.bulkDelete('construction_role', null, {});
    await queryInterface.bulkDelete('construction_card_type', null, {});
    await queryInterface.bulkDelete('years_experience', null, {});
    await queryInterface.bulkDelete('daily_job_update', null, {});
  },
};
