import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { getUserAchievements, giveAchievement } from "../../controllers/AchievementController";
import { getScoresByUserAndGame } from '../../controllers/LeaderboardController';
import AchievementNotification from "../../components/achievements/AchievementNotification";
import catImage from './images/cat.png';
import catWalkImage from './images/catwalk.gif'
import obstacleImage from './images/obstacle.gif';
import { useAuth } from '../../context/AuthContext';
import './AutoRunner.css';
import { saveScore } from '../../controllers/AutoRunnerController';

const AutoRunner = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [benchmark, setBenchmark] = useState(0);
    const [gameText, setGameText] = useState("Press Space to Start!");
    const [catSrc, setCatSrc] = useState(catImage);
    const [achievementTitle, setAchievementTitle] = useState('');
    const [achievement1Flag, setAchievement1Flag] = useState(false);
    const achievement1Id = 6;
    const [userAchievements, setUserAchievements] = useState([]);
    const catRef = useRef(null);
    const obstacleRef = useRef(null);
    const gameAreaRef = useRef(null);
    const { currentUser } = useAuth();
    const MAX_SPEED = 25

    const getHighScore = async () => {
        let userHighScore = 0;
        let scores = await getScoresByUserAndGame(currentUser.userId, "cat-run");
        if (scores != null)
        {
            scores.forEach(score => {
                if (score.score > userHighScore) { userHighScore = score.score; }
            });
        }
        return userHighScore;
    }
    
    const initialize = async () => 
    {
        if (currentUser != null)
        {
            setHighScore(await getHighScore());
            setUserAchievements(await fetchAchievements());
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        userAchievements.forEach(achievement => {
            if (achievement === achievement1Id)
            {
                console.log("User has achievement.")
                setAchievement1Flag(true); 
            };
        });
    }, [userAchievements])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space')
            {
                if (!isPlaying)
                {
                    setGameText("");
                    startGame();
                } 
                else 
                {
                    jump();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    useEffect(() => {
        let gameTimer;

        if (isPlaying) 
        {
            gameTimer = setInterval(() => {
                setScore((prevScore) => prevScore + 1);
                updateGameArea();
            }, 20);
        } 
        else
        {
            setCatSrc(catImage);
            clearInterval(gameTimer);
            if (score === highScore && score != 0) { saveScore(currentUser.userId, score) }
        }

        return () => clearInterval(gameTimer);
    }, [isPlaying, score, highScore]);

    useEffect(() => {
        if (score > highScore) 
        {
            setHighScore(score);
        }
    }, [score, highScore]);

    // Check for achievements when score reaches multiples of 1000
    useEffect(() => { 
        if (!achievement1Flag)
        {
            const milestone = Math.floor(score / 1000) * 1000;
            if (milestone === 1000)
            {
                setAchievementTitle("It's Over Nine-Meowsand!");
                if (currentUser != null) { giveAchievement(currentUser.userId, achievement1Id); }
                setAchievement1Flag(true);
            }
        }
    }, [score]);

    useEffect(() => {
        if (score >= benchmark && speed <= MAX_SPEED)
        {
            setBenchmark((prevBenchmark) => prevBenchmark + 500);
            setSpeed((prevSpeed) => prevSpeed + 1);
        }
    }, [score, speed, benchmark]);

    const fetchAchievements = async () => 
    {
        const res = await getUserAchievements(currentUser.userId);;
        return res;
    }

    const startGame = () => {
        setCatSrc(catWalkImage);
        setSpeed(7);
        setBenchmark(500);
        setIsPlaying(true);
        setScore(0);
        catRef.current.style.bottom = '0px';
        obstacleRef.current.style.left = '101%';
    };

    const jump = () => {
        if (catRef.current.classList !== 'jump') 
        {
            catRef.current.classList.add('jump');
            setTimeout(() => {
                catRef.current.classList.remove('jump');
            }, 1000);
        }
    };

    const updateGameArea = () => {
        const catBottom = parseInt(window.getComputedStyle(catRef.current).getPropertyValue('bottom'));
        const obstacleLeft = parseInt(window.getComputedStyle(obstacleRef.current).getPropertyValue('left'));

        //checks for collision
        if (obstacleLeft < 50 && obstacleLeft > 0 && catBottom < 50) 
        {
            setIsPlaying(false);
            setGameText("Game Over!\nPress Space to try again.")
        }

        //moves the obstacle
        obstacleRef.current.style.left = `${obstacleLeft - speed}px`;

        //increments the score
        if (obstacleLeft < -10) 
        {
            obstacleRef.current.style.left = '101%';
        }
    };

    return (
        isLoading ? (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        ) : (
            <div className="gameBody">
                {/* notification component that pops up the achievement */}
                {achievementTitle && <AchievementNotification achievementTitle={achievementTitle} />}
        
                <div className="d-flex align-items-center justify-content-center">
                    <div className="game-area" ref={gameAreaRef}>
                        <div className="scores">
                        <p className="mt-2">High Score: {highScore}</p>
                        <p>Score: {score}</p>
                        </div>
                        <p>{gameText}</p>
                        <img
                        className={`cat ${isPlaying ? 'running' : ''}`}
                        ref={catRef}
                        src={catSrc}
                        onClick={jump}
                        alt="Cat"
                        />
                        <img
                        className="obstacle"
                        ref={obstacleRef}
                        src={obstacleImage}
                        alt="Obstacle"
                        />
                    </div>
                </div>
            </div>
        )
    );      
};

export default AutoRunner;