function VisitOccurrence() {
  this.visitOccurrenceId = 0;
  this.personId = 0;
  this.visitConceptId = 0;
  this.visitStartDate = 0;
  this.visitStartDatetime = null;
  this.visitEndDate = 0;
  this.visitEndDatetime = null;
  this.visitTypeConceptId = 0;
  this.providerId = 0;
  this.careSiteId = 0;
  this.visitSourceValue = null;
  this.visitSourceConceptId = 0;
  this.admittingSourceConceptId = 0;
  this.admittingSourceValue = null;
  this.dischargeToConceptId = 0;
  this.dischargeToSourceValue = null;
  this.precedingVisitOccurrenceId = 0;
}

module.exports = VisitOccurrence;
