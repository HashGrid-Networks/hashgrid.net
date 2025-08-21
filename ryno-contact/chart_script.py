import plotly.graph_objects as go

# Data with abbreviated metric names to fit 15-char limit
metrics = ["Energy Costs", "Cooling Costs", "Hash Rate", "HW Lifespan", "Op Efficiency"]
traditional = [100, 100, 100, 100, 100]
terrahash = [50, 60, 133, 130, 180]

# Create grouped bar chart
fig = go.Figure()

# Add Traditional Mining bars (using cyan for blue)
fig.add_trace(go.Bar(
    x=metrics,
    y=traditional,
    name='Traditional',
    marker_color='#5D878F',
    text=[f'{val}%' for val in traditional],
    textposition='auto',
    cliponaxis=False
))

# Add TerraHash Stack bars (using sea green)
fig.add_trace(go.Bar(
    x=metrics,
    y=terrahash,
    name='TerraHash',
    marker_color='#2E8B57',
    text=[f'{val}%' for val in terrahash],
    textposition='auto',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='TerraHash Stack Performance Advantages',
    xaxis_title='Metrics',
    yaxis_title='Percentage (%)',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('terrahash_performance_chart.png')