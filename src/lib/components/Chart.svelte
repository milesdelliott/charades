<script lang="ts">
import {onMount} from 'svelte';
export let gamma;
export let beta;

$: gammaValues = [];
$: betaValues = [];

const logVals = () => {
    console.log(gammaValues,
betaValues)
    gammaValues.push(gamma)
    gammaValues = gammaValues.slice(-20);
    betaValues.push(beta)
    betaValues = betaValues.slice(-20);
}

const valsToPath = values => values.reduce((path, value, index) => {
    const percentageValue = Math.floor(((value + 90) / 180) * 100)
    if (index === 0) {
        return `M 0 ${percentageValue}`
    }
    return `${path} L ${index * 5} ${percentageValue}`
}, '');

onMount(() => {
    window.setInterval(logVals, 1000) 
});

</script>

<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
<path class="axis" d="M 0 0 v 100" />
<path class="axis" d="M 0 100 h 100" />
<path class="gamma" d="{valsToPath(gammaValues)}" />
<path class="beta"d="{valsToPath(betaValues)}"  />
</svg>

<style>
svg {
    height: 400px;
    width: 400px;
    max-height: 100vh;
    max-width: 100vw;
}
.axis {
    stroke-width: 2;
    stroke: black;
}

.gamma, .beta {
    stroke-width: 2;
    stroke: blue;
    fill: none;
}

.gamma {
    stroke: red;
}
</style>