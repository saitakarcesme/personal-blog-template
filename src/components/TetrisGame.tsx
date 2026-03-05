"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useThemeClasses } from "./useThemeClasses";

// The size of the playfield
const ROWS = 14;
const COLS = 10;

// Original Tailwind colors
const TETROMINOS: Record<string, { shape: number[][]; color: string; shadow: string }> = {
    clear: { shape: [[0]], color: "bg-transparent", shadow: "" },
    I: {
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        color: "bg-cyan-500",
        shadow: "",
    },
    J: {
        shape: [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0],
        ],
        color: "bg-blue-500",
        shadow: "",
    },
    L: {
        shape: [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ],
        color: "bg-orange-500",
        shadow: "",
    },
    O: {
        shape: [
            [4, 4],
            [4, 4],
        ],
        color: "bg-yellow-500",
        shadow: "",
    },
    S: {
        shape: [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ],
        color: "bg-green-500",
        shadow: "",
    },
    T: {
        shape: [
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0],
        ],
        color: "bg-purple-500",
        shadow: "",
    },
    Z: {
        shape: [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ],
        color: "bg-red-500",
        shadow: "",
    },
};

const SHAPES = ["I", "J", "L", "O", "S", "T", "Z"];

const randomTetromino = () => {
    const t = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return TETROMINOS[t];
};

const createEmptyBoard = () =>
    Array.from(Array(ROWS), () => new Array(COLS).fill([0, "clear"]));

export function TetrisGame() {
    const tc = useThemeClasses();
    const [board, setBoard] = useState(createEmptyBoard());
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS.I.shape,
        color: TETROMINOS.I.color,
        shadow: TETROMINOS.I.shadow,
        collided: false,
    });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [playing, setPlaying] = useState(false);

    // Initialize Player
    const resetPlayer = useCallback(() => {
        const nextTetro = randomTetromino();
        setPlayer({
            pos: { x: COLS / 2 - 2, y: 0 },
            tetromino: nextTetro.shape,
            color: nextTetro.color,
            shadow: nextTetro.shadow,
            collided: false,
        });
    }, []);

    // We derive the visual board based on the base static board combined with the player's current tetro

    const derivedBoard = board.map((row) =>
        row.map((cell) => (cell[1] === "clear" ? [0, "clear"] : cell))
    );

    if (playing) {
        player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0 && derivedBoard[y + player.pos.y]) {
                    derivedBoard[y + player.pos.y][x + player.pos.x] = [
                        value,
                        player.collided ? "merged" : "clear",
                        player.color,
                        player.shadow,
                    ];
                }
            });
        });
    }

    const checkCollision = (
        tetro: any[],
        targetPos: { x: number; y: number },
        brd: any[]
    ) => {
        for (let y = 0; y < tetro.length; y += 1) {
            for (let x = 0; x < tetro[y].length; x += 1) {
                if (tetro[y][x] !== 0) {
                    if (
                        !brd[y + targetPos.y] ||
                        !brd[y + targetPos.y][x + targetPos.x] ||
                        brd[y + targetPos.y][x + targetPos.x][1] === "merged"
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Movements
    const movePlayer = useCallback((dir: number) => {
        if (!checkCollision(player.tetromino, { x: player.pos.x + dir, y: player.pos.y }, board)) {
            setPlayer((prev) => ({ ...prev, pos: { x: prev.pos.x + dir, y: prev.pos.y } }));
        }
    }, [player, board]);

    const dropPlayer = useCallback(() => {
        if (!checkCollision(player.tetromino, { x: player.pos.x, y: player.pos.y + 1 }, board)) {
            setPlayer((prev) => ({ ...prev, pos: { x: prev.pos.x, y: prev.pos.y + 1 } }));
        } else {
            if (player.pos.y < 1) {
                setGameOver(true);
                setPlaying(false);
            }

            // Merge the piece into the board on collision
            const newBoard = board.map((row) => [...row]);
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0 && newBoard[y + player.pos.y]) {
                        newBoard[y + player.pos.y][x + player.pos.x] = [
                            value,
                            "merged",
                            player.color,
                            player.shadow,
                        ];
                    }
                });
            });

            // Sweep rows and update the board
            const swept = newBoard.reduce((ack: any[], row: any[]) => {
                if (row.findIndex((cell: any[]) => cell[0] === 0) === -1) {
                    setScore((prev) => prev + 10);
                    ack.unshift(new Array(COLS).fill([0, "clear", "", ""]));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);

            setBoard(swept);

            // Spawn next piece
            resetPlayer();
        }
    }, [player, board, resetPlayer]);

    const rotatePlayer = useCallback(() => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        // Transpose
        const rotated = clonedPlayer.tetromino.map((_: any, index: number) =>
            clonedPlayer.tetromino.map((col: any) => col[index])
        );
        // Reverse
        clonedPlayer.tetromino = rotated.map((row: any[]) => row.reverse());

        if (!checkCollision(rotated, clonedPlayer.pos, board)) {
            setPlayer({ ...clonedPlayer, tetromino: rotated });
        }
    }, [player, board]);

    useEffect(() => {
        if (!playing || gameOver) return;
        const interval = setInterval(() => {
            dropPlayer();
        }, 800);
        return () => clearInterval(interval);
    }, [playing, gameOver, dropPlayer]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling when playing
            if (playing && ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) {
                e.preventDefault();
            }

            if (!playing || gameOver) return;
            switch (e.key) {
                case "ArrowLeft":
                    movePlayer(-1);
                    break;
                case "ArrowRight":
                    movePlayer(1);
                    break;
                case "ArrowDown":
                    dropPlayer();
                    break;
                case "ArrowUp":
                    rotatePlayer();
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playing, gameOver, movePlayer, dropPlayer, rotatePlayer]);

    const startGame = () => {
        // Need to focus the window or a container so arrow keys work immediately
        setBoard(createEmptyBoard());
        setGameOver(false);
        setScore(0);
        resetPlayer();
        setPlaying(true);
    };

    const stopGame = () => {
        setPlaying(false);
        setGameOver(true);
    }

    return (
        <div className="mt-8 mb-6 flex w-full flex-col items-center">
            {/* HEADER SECTION */}
            <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-white/50 w-full max-w-[220px] flex justify-between">
                <span>TETRIS</span>
                <span>SCORE: {score}</span>
            </h2>

            {/* CONTROLS SECTION */}
            <div className="mb-3 flex w-full max-w-[220px] justify-between gap-2">
                {!playing ? (
                    <button
                        onClick={startGame}
                        className="flex-1 rounded-xl border border-white/10 bg-black/20 p-2 text-xs font-medium text-white/90 transition hover:border-white/20 hover:bg-white/[0.06] focus:outline-none"
                    >
                        PLAY
                    </button>
                ) : (
                    <button
                        onClick={stopGame}
                        className="flex-1 rounded-xl border border-white/10 bg-black/20 p-2 text-xs font-medium text-white/90 transition hover:border-white/20 hover:bg-white/[0.06] focus:outline-none"
                    >
                        STOP
                    </button>
                )}

                <button
                    onClick={startGame}
                    className="flex-1 rounded-xl border border-white/10 bg-black/20 p-2 text-xs font-medium text-white/90 transition hover:border-white/20 hover:bg-white/[0.06] focus:outline-none"
                >
                    RESTART
                </button>
            </div>

            {/* GAME BOARD SECTION */}
            <div
                className="relative grid rounded-xl bg-black/20 p-[2px] border border-white/10 shadow-inner overflow-hidden"
                style={{
                    gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                    width: "220px",
                    height: "308px",
                }}
                tabIndex={0} // Allows capturing keydown immediately if clicked
            >
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                        <span className="text-xl font-bold tracking-widest text-white/90">GAME OVER</span>
                    </div>
                )}
                {derivedBoard.map((row, y) =>
                    row.map((cell, x) => {
                        const isFilled = cell[0] !== 0;
                        const colorClass = isFilled ? cell[2] : "bg-transparent";

                        return (
                            <div
                                key={`${y}-${x}`}
                                className={`border border-white/5 ${colorClass} relative rounded-[2px]`}
                            >
                                {isFilled && <div className="absolute inset-px bg-white/10 rounded-[1px]" />}
                            </div>
                        );
                    })
                )}
            </div>



            <p className="mt-4 text-[10px] text-white/40 uppercase tracking-widest text-center hidden sm:block">
                Arrows to Move & Rotate
            </p>

            {/* Mobile Touch Controller (Theme Based) */}
            <div className={`mt-8 relative w-[200px] h-[200px] flex items-center justify-center sm:hidden touch-none select-none rounded-3xl ${tc.card}`}>

                {/* UP */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <button
                        onPointerDown={(e) => { e.preventDefault(); if (playing && !gameOver) rotatePlayer(); }}
                        className={`flex items-center justify-center w-[52px] h-[52px] rounded-full shadow-[6px_6px_10px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.05),inset_2px_2px_5px_rgba(255,255,255,0.08),inset_-3px_-3px_7px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] transition-shadow duration-75 ${tc.gameBtn}`}
                    >
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#000000] opacity-80 shadow-[0_2px_2px_rgba(255,255,255,0.1)] mb-1" />
                    </button>
                </div>

                {/* LEFT */}
                <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center">
                    <button
                        onPointerDown={(e) => { e.preventDefault(); if (playing && !gameOver) movePlayer(-1); }}
                        className={`flex items-center justify-center w-[52px] h-[52px] rounded-full shadow-[6px_6px_10px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.05),inset_2px_2px_5px_rgba(255,255,255,0.08),inset_-3px_-3px_7px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] transition-shadow duration-75 ${tc.gameBtn}`}
                    >
                        <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-[#000000] opacity-80 shadow-[2px_0_2px_rgba(255,255,255,0.1)] mr-1" />
                    </button>
                </div>

                {/* RIGHT */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center">
                    <button
                        onPointerDown={(e) => { e.preventDefault(); if (playing && !gameOver) movePlayer(1); }}
                        className={`flex items-center justify-center w-[52px] h-[52px] rounded-full shadow-[6px_6px_10px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.05),inset_2px_2px_5px_rgba(255,255,255,0.08),inset_-3px_-3px_7px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] transition-shadow duration-75 ${tc.gameBtn}`}
                    >
                        <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#000000] opacity-80 shadow-[-2px_0_2px_rgba(255,255,255,0.1)] ml-1" />
                    </button>
                </div>

                {/* DOWN */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <button
                        onPointerDown={(e) => { e.preventDefault(); if (playing && !gameOver) dropPlayer(); }}
                        className={`flex items-center justify-center w-[52px] h-[52px] rounded-full shadow-[6px_6px_10px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.05),inset_2px_2px_5px_rgba(255,255,255,0.08),inset_-3px_-3px_7px_rgba(0,0,0,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] transition-shadow duration-75 ${tc.gameBtn}`}
                    >
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#000000] opacity-80 shadow-[0_-2px_2px_rgba(255,255,255,0.1)] mt-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
