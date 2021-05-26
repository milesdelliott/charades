<script lang="ts">
    import {onMount} from 'svelte';
    import { writable } from 'svelte/store';
    import {setupGame} from '$lib/data/store'
	export let category;
    export const ssr = false;
    const {gameState, skipWord, answerWord, start, reset} = setupGame(category)

    $: currentWord = $gameState.wordState[$gameState.currentIndex]
    $: gameOngoing = $gameState.hasStarted && $gameState.prepTime < 1 && !$gameState.isOver
    $: gamma = 0
    const handleOrientation = event => {
        console.log(event.gamma)
        gamma = event.gamma
    }

    const handleStartClick = () => {
    // feature detect
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
              start();
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }
  }

</script>
<main>
    <h1>
        {gamma}
    </h1>
    {#if ! $gameState.hasStarted}
        <button class="start" on:click={handleStartClick}>start</button>
    {/if}
    {#if $gameState.hasStarted && $gameState.prepTime > 0}
        <p class="prep-time">...{$gameState.prepTime}</p>
    {/if}
    {#if gameOngoing}
    <button on:click={answerWord}>answer</button>
    <button on:click={skipWord}>skip</button>
    <h2>{currentWord.value}</h2>
    <p class="time-remaining">{$gameState.timeRemaining}s</p>
    {/if}
    
    {#if $gameState.isOver}
    <p class="round-over">Round Over</p>
    {#if $gameState.score}
    <div class="stats">
        <p class="score">{$gameState.score.correct} Correct</p>
        <p class="accuracy">{$gameState.score.accuracy}%</p>
    </div>
    {/if}
    <ul class="results">
        {#each $gameState.wordState as word}
        <li class="result-word {word.correct ? 'correct' : 'incorrect'}">{word.value}</li>
        {/each}
    </ul>
    <button class="reset" on:click={reset}>reset</button>
    {/if}
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        position: absolute;
        top: 0;
        left: 0;
        padding: 1rem;
        box-sizing: border-box;
        font-family: sans-serif;
        display: grid;
        grid-template-rows: 4rem 1fr;
    }

    h1 {
        margin: 0;
        top: 1rem;
        left: 1rem;
        opacity: 0.7;
        font-size: 1rem;
        font-weight: bold;
        text-transform: uppercase;
        position: absolute;
    }

    h2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
font-size: 4rem;
        font-weight: bold;
        text-align: center;
    }

    .start {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: none;
        padding: 2rem;
        font-size: 3rem;
        background: #aaa;
    }

    .prep-time {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        margin: 0;
    }

    li {
        list-style-type: none;
        font-weight: bold;
        opacity: 0.4;
        flex: 1 1 auto;
        margin-bottom: 1rem;
    }
    .correct {
        opacity: 1;
    }
    .reset{
        margin: 0;
        bottom: 0;
        right: 0;
        padding: 2rem 1rem 1rem 2rem;
        background: #333;
        color: white;
        border-width: 0;
        border-top-left-radius: 100%;
        font-size: 2rem;
        font-weight: bold;
        position: absolute;
        cursor: pointer;
    }
    .time-remaining {
        margin: 0;
        bottom: 1rem;
        right: 1rem;
        font-size: 2rem;
        font-weight: bold;
        position: absolute;
    }
    .round-over {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 1rem;
        margin: 0;
        font-size: 2rem;
    }

    .stats {
        display: flex;
        justify-content: space-between;
    }
    .results {
        margin: 0;
        padding: 0;
        display: flex;
        flex-flow: column wrap;
        max-height: calc(100vh - 6rem);
    }
</style>