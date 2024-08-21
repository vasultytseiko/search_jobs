import { randomUUID } from 'crypto';

export const DocumentTypesExample = {
  personalDocumentTypes: [
    {
      id: randomUUID(),
      name: 'Passport',
    },
    {
      id: randomUUID(),
      name: 'ID Card',
    },
  ],
  experienceDocumentTypes: [
    {
      id: randomUUID(),
      name: 'Payslip',
    },
    {
      id: randomUUID(),
      name: 'Qualification License',
    },
  ],
};

export const CandidateDocumentsExample = {
  id: randomUUID(),
  personal_document_name: 'Passport.png',
  experience_document_name: 'Payslip.pdf',
  personal_document_type_id: randomUUID(),
  experience_document_type_id: randomUUID(),
  personal_document_status: 'pending',
  experience_document_status: 'pending',
};

export const SearchCandidatesExample = [
  {
    id: 'bdf9ca38-3a4e-42e7-87b4-fe31e8e9a523',
    email: 'can11@gmail.com',
    first_name: 'can11',
    last_name: 'can11',
    phone_number: '+441172345621',
    postcode: 'E1W 1BQ',
    postcode_latitude: 51.50576,
    postcode_longitude: -0.067662,
    photo: null,
    candidate_data: {
      id: '8e4a3dc6-ebd5-4193-ba54-c3f5648f7335',
      agreement_to_contact: true,
      verified: false,
      hospitality_first_role_id: '405b45f4-32b8-4f7e-a4b2-c36bd91e4782',
      hospitality_second_role_id: '596a9be9-dc95-4e0e-ba16-4d68bfca01b4',
      hospitality_main_establishment_id: 'd8211be8-4a10-4c5c-b0b0-94cb5ed9d3d5',
      hospitality_second_establishment_id:
        '8253240c-c161-455a-a667-4989a1f290bf',
      construction_role_id: 'bdf9ca38-3a4e-42e7-87b4-fe31e8e9a523',
      construction_card_type_id: 'bdf9ca38-3a4e-42e7-87b4-fe31e8e9a523',
      years_experience_id: 'e71dc953-a145-46cb-8a81-6782961f8e5e',
      daily_job_update_id: 'a3df74f9-699f-4564-b470-53ef8ddae1dc',
      skills: [
        '110fb8f4-b466-4c7b-8fd4-7b150f5c1236',
        '89fc7713-86aa-4f25-a49c-5d83714d4d54',
        'b7e87cc0-f067-4370-8300-f8d5fa5840e3',
      ],
    },
    distance_km: 10.8654146225541,
  },
];
