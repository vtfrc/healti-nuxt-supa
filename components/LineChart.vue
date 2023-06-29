<template>
<div>
    <canvas ref="chart" />
</div>
</template>

<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        chartData: {
        type: Object,
        required: true,
        },
    },
    mounted() {
        this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false })
    },
}
</script>