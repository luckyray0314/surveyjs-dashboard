const surveyId = "1";

function init (json) {
  const survey = new Survey.SurveyModel(json);

  SurveyAnalyticsTabulator.Table.showFilesAsImages = true;

  function getPaginatedData({ offset, limit, filter, sort }) {
    const endpointUrl = "/api/paginatedresults";
    const params = { offset, limit, filter: JSON.stringify(filter), sort: JSON.stringify(sort), postId: surveyId };
    const url = new URL(window.location.origin + endpointUrl);
    url.search = new URLSearchParams(params).toString();
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json().then(result => resolve(result)))
        .catch(() => reject());
    });
  }

  const tabulator = new SurveyAnalyticsTabulator.Tabulator(
    survey,
    getPaginatedData
  );

  tabulator.render("tabulatorContainer");
}

fetch("/api/getSurvey?surveyId=" + surveyId).then(res => res.json()).then(survey => init(survey.json));