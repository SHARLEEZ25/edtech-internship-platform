const controllers = {
  recruiterProfessional: require('./controllers/recruiterProfessional.controller'),
  recruiterCompany: require('./controllers/recruiterCompany.controller'),
  recruiterDescription: require('./controllers/recruiterDescription.controller'),
};

const services = {
  recruiterProfessional: require('./services/recruiterProfessional.service'),
  recruiterCompany: require('./services/recruiterCompany.service'),
  recruiterDescription: require('./services/recruiterDescription.service'),
};

const validations = {
  recruiterProfessional: require('./validations/recruiterProfessional.validation'),
  recruiterCompany: require('./validations/recruiterCompany.validation'),
  recruiterDescription: require('./validations/recruiterDescription.validation'),
};

module.exports = { controllers, services, validations };
