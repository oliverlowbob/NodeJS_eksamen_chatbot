
// exports.seed = function(knex) {
//   // Deletes ALL existing entries
//   return knex('users').del()
//   .then(() =>{
//     return knex('roles').del()

//   })

// };

exports.seed = function(knex) {
  return knex('roles').insert([
    {role: 'ADMIN'},
    {role: 'MODERATOR'},
    {role: 'USER'}
  ]);
};