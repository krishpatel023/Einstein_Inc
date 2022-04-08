const mongoose = require('mongoose');
 
  const workSchema = {
    // userID: {
    //     type: String,
    //     required: true
    // },
    name: {
      type: String,
      required: true
    },
    checklist: {
      type: Boolean,
      required: true
    }
  };
  
  const Work = mongoose.model("workItem", workSchema);
  
  

  module.exports = Work;