export function SourceSummary() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-muted/40 rounded-lg p-4">
          <div className="text-sm font-medium mb-1">Total Sources</div>
          <div className="text-3xl font-bold">142</div>
          <div className="text-xs text-muted-foreground mt-1">87 primary, 55 secondary</div>
        </div>
        <div className="bg-muted/40 rounded-lg p-4">
          <div className="text-sm font-medium mb-1">Average Relevance</div>
          <div className="text-3xl font-bold">78%</div>
          <div className="text-xs text-muted-foreground mt-1">+5% from previous analysis</div>
        </div>
        <div className="bg-muted/40 rounded-lg p-4">
          <div className="text-sm font-medium mb-1">Date Range</div>
          <div className="text-3xl font-bold">6 months</div>
          <div className="text-xs text-muted-foreground mt-1">Jan 2023 - Jul 2023</div>
        </div>
      </div>

      <div className="prose max-w-none">
        <h3>Key Findings</h3>
        <p>
          The analysis of 142 sources on climate change research reveals a significant focus on policy implications and
          economic impacts. Scientific sources constitute the largest category (42%), followed by policy documents (28%)
          and technical reports (25%).
        </p>
        <p>
          There is a notable increase in publications during May 2023, coinciding with several major climate policy
          announcements. High-impact sources represent 35% of the total, with the majority focusing on mitigation
          strategies rather than adaptation.
        </p>
        <h3>Predominant Themes</h3>
        <ul>
          <li>Carbon emission reduction strategies (mentioned in 78% of sources)</li>
          <li>Economic implications of climate policies (65%)</li>
          <li>Renewable energy transitions (58%)</li>
          <li>Climate justice and equity considerations (42%)</li>
          <li>Technological innovations for climate adaptation (37%)</li>
        </ul>
        <h3>Recommendations</h3>
        <p>
          Based on the analysis, further investigation into the economic feasibility of proposed climate policies is
          recommended. There is also a gap in research regarding regional climate impacts, suggesting an opportunity for
          more focused studies in this area.
        </p>
      </div>
    </div>
  )
}

