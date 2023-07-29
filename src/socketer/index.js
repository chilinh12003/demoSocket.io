
//! NOTE: Soketer là export 1 class chứ ko phải 1 Instance
const Action_1 = require('./fb/action_1.sockter');
const Action_2 = require('./fb/action_2.sockter');
module.exports = {
    fb: {
        Action_1,
        Action_2,
    },
};