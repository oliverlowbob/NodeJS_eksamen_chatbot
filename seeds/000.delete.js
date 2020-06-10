
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
  .then(() =>{
    return knex('roles').del()

  })

};
