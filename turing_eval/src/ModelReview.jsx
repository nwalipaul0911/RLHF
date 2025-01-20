import React, { useState } from "react";
import  reviewData  from "./questions.json"; // Import JSON as a JS object
import "./ModelReview.css";
import ReportView from "./ReportView"; // Assuming this component exists

function ModelReview({ modelName }) {
  const initializeResponses = () =>
    Object.keys(reviewData).reduce((acc, category) => {
      acc[category] = reviewData[category].map(() => ({
        response: null,
        description: "",
        severity: "No issues", // Default severity for "True"
      }));
      return acc;
    }, {});

  const [responses, setResponses] = useState(initializeResponses());
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleResponseChange = (category, index, response) => {
    setResponses((prev) => {
      const updatedCategory = [...prev[category]];
      updatedCategory[index].response = response;
      updatedCategory[index].severity = response
        ? "No issues"
        : reviewData[category][index].severity; // Use the severity from the JSON for "False"
      if (response === true) {
        updatedCategory[index].description = ""; // Clear description if user selects "True"
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  const handleDescriptionChange = (category, index, newDescription) => {
    setResponses((prev) => {
      const updatedCategory = [...prev[category]];
      updatedCategory[index].description = newDescription;
      return { ...prev, [category]: updatedCategory };
    });
  };

  const validateResponses = () => {
    const missingDescriptions = Object.keys(responses).some((category) =>
      responses[category].some(
        (response) =>
          response.response === false && response.description.trim() === ""
      )
    );

    if (missingDescriptions) {
      setError("Each category with a 'False' response must have a description.");
      return false;
    }
    setError(null);
    return true;
  };

  const generateReport = () => {
    if (!validateResponses()) return;

    const report = Object.keys(responses).reduce((acc, category) => {
      const categoryResponses = responses[category];

      const highestSeverity = categoryResponses.reduce((highest, response) => {
        const severityLevels = ["No issues", "Minor", "Moderate", "Major"];
        const currentIndex = severityLevels.indexOf(response.severity);
        const highestIndex = severityLevels.indexOf(highest);

        return currentIndex > highestIndex ? response.severity : highest;
      }, "No issues");

      const descriptions = categoryResponses
        .filter((response) => response.response === false)
        .map((response) => response.description);

      acc[category] = {
        highestSeverity,
        descriptions,
      };

      return acc;
    }, {});

    setReport(report);
    console.log(`${modelName} Review Report:`, report);
    alert(`${modelName} Review Report generated!`);
  };

  return (
    <div className="ModelReview">
      {error && <div className="error-message">{error}</div>}
      {Object.keys(reviewData).map((category) => (
        <div key={category} className="category">
          <h3>{category}</h3>
          {reviewData[category].map((item, index) => (
            <div key={index} className="question">
              <p>
                {item.Question} <span className="severity">({item.severity})</span>
              </p>
              <div className="responses">
                <button
                  className={
                    responses[category][index].response === true ? "selected" : ""
                  }
                  onClick={() => handleResponseChange(category, index, true)}
                >
                  True
                </button>
                <button
                  className={
                    responses[category][index].response === false ? "selected" : ""
                  }
                  onClick={() => handleResponseChange(category, index, false)}
                >
                  False
                </button>
              </div>
              {responses[category][index].response === false && (
                <div className="description">
                  <textarea
                    placeholder="Provide a description for this issue..."
                    value={responses[category][index].description}
                    onChange={(e) =>
                      handleDescriptionChange(category, index, e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          ))}
          <hr />
        </div>
      ))}
      <button className="submit" onClick={generateReport}>
        Generate {modelName} Report
      </button>
      {report && <ReportView report={report} />}
    </div>
  );
}

export default ModelReview;
