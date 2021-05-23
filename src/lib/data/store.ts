import { writable } from 'svelte/store';

export type Wordlist = string[];

type GameState = {
	currentIndex: number;
	wordState: WordState[];
    hasStarted: boolean,
	isOver: boolean;
    prepTime: number,
    timeRemaining: number;
    interval: number;
    score: null | {
        accuracy: number;
        correct: number;
        total: number;
    }
};

type WordState = {
    value: string,
    correct: boolean
};

export type Category = {
	wordList: Wordlist;
	name: string;
	slug: string;
};

type AdvanceFn = (state: GameState) => GameState;



const processWordList : (w: Wordlist) => WordState[] = ( wordList ) =>
	wordList
		.sort(() => Math.random() - 0.5)
		.map((value) => ({
			value,
			correct: false
		}));

const answerWord: AdvanceFn = (state) => ({
	...state,
	currentIndex: state.currentIndex + 1,
	wordState: state.wordState.map((word, index) => {
		if (index !== state.currentIndex) {
			return word;
		}
		return { ...word, correct: true };
	})
});

const isLastWord = (state: GameState) => state.wordState.length - 1 < state.currentIndex + 1;

const advanceWord = (advanceFn: AdvanceFn) => (state: GameState) => {
	if (isLastWord(state)) {
        clearInterval(state.interval)
        const newState = advanceFn(state); 
		return {
            ...newState,
            interval: null,
            isOver: true,
            score: newState.wordState.reduce(scoreReducer, {correct: 0, accuracy: 0, total: 0}),
        };
	}
	return advanceFn(state);
};

const skipWord: AdvanceFn = (state) => ({ ...state, currentIndex: state.currentIndex + 1 });

const scoreReducer = (score, word, index) => {
    console.log(score, word, index)
    const correct = word.correct ? score.correct + 1 : score.correct;
    const total = index + 1;
    return {
        accuracy: Math.floor((correct / total) * 100),
        correct,
        total,
    }
}

const tickHandler: AdvanceFn = state => {
    if (state.prepTime > 0) {
        return {
            ...state,
            prepTime: state.prepTime - 1,
        }
    }
    if (state.timeRemaining - 1 < 0) {
        clearInterval(state.interval)
        return {
            ...state,
            timeRemaining: 0,
            score: state.wordState.reduce(scoreReducer, {correct: 0, accuracy: 0, total: 0}),
            isOver: true
        }
    }
    return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
    }
}

const reset = (state) => {
    clearInterval(state.interval)
    return generateInitialState({wordList: state.wordState.map(s => s.value)})
}

const generateInitialState = ({wordList}) => ({
    currentIndex: 0,
    wordState: processWordList(wordList),
    isOver: false,
    hasStarted: false,
    timeRemaining: 30,
    prepTime: 5,
    interval: null,
    score: null,
})


export const setupGame = (category: Category) => {
	const gameState = writable<GameState>(generateInitialState(category));

    const start: AdvanceFn = state => {
        if (state.hasStarted) {
            return state
        }
        return {
            ...state,
            hasStarted: true,
            interval: window.setInterval(() => gameState.update(tickHandler), 1000) 
        }
    }
	return {
		gameState,
		skipWord: () => {
			gameState.update(advanceWord(skipWord));
		},
		answerWord: () => {
			gameState.update(advanceWord(answerWord));
		},
        start: () => {
			gameState.update(start);
		},
        reset: () => {
            gameState.update(reset);
        }
	};
};
