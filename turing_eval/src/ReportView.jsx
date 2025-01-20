import React from 'react';
import './ReportView.css';

function ReportView({ report }) {
  const handleCopyToClipboard = () => {
    const reportText = Object.keys(report)
      .map(category => {
        let categoryText = `**${category}:** ${report[category].highestSeverity}\n`;
        report[category].descriptions.forEach((description, idx) => {
          categoryText += `${idx + 1}. ${description}\n`;
        });
        categoryText += '\n';
        return categoryText;
      })
      .join('');
    
    navigator.clipboard.writeText(reportText).then(() => {
      alert('Report copied to clipboard!');
    });
  };

  return (
    <div className="ReportView">
      <h2>Review Report</h2>
      {Object.keys(report).map((category) => (
        <div key={category} className="report-category">
          <h3>{category} <i>{report[category].highestSeverity}</i></h3>
          <ul>
            {report[category].descriptions.map((description, index) => (
              <li key={index}>{description}</li>
            ))}
          </ul>
        </div>
      ))}
      <button className="copy-button" onClick={handleCopyToClipboard}>Copy to Clipboard</button>
    </div>
  );
}

export default ReportView;
