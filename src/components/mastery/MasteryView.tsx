import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore, getLevelInfo } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const MasteryView: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgressStore();

  const totalXP = progress.gameStats.totalPoints;
  const levelInfo = getLevelInfo(totalXP);

  return (
    <div className="mastery-page">
      <SeoHead
        title={seoData.mastery.title}
        description={seoData.mastery.description}
        canonical={seoData.mastery.canonical}
        keywords={seoData.mastery.keywords}
        jsonLd={seoData.mastery.jsonLd}
      />
      <div className="mastery-card">
        
        <div className="mastery-icon">🎓</div>
        
        <h1 className="mastery-title">
          Master of Crystallography
        </h1>
        
        <p className="mastery-desc">
          Congratulations! You have successfully completed the rigorous training program, demonstrating exceptional understanding of Miller indices, reciprocal space, and crystal planes.
        </p>

        <div className="mastery-credentials-box">
          <h3 className="mastery-credentials-heading">Final Credentials</h3>
          
          <div className="mastery-credentials-row">
            <div className="mastery-stat-item">
              <div className="mastery-stat-num cyan">{levelInfo.level}</div>
              <div className="mastery-stat-lbl">Final Level</div>
            </div>
            <div className="mastery-divider"></div>
            <div className="mastery-stat-item">
              <div className="mastery-stat-num purple">{totalXP}</div>
              <div className="mastery-stat-lbl">Total XP</div>
            </div>
            <div className="mastery-divider"></div>
            <div className="mastery-stat-item">
              <div className="mastery-stat-num green">{progress.gameStats.maxStreak}</div>
              <div className="mastery-stat-lbl">Max Streak</div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary mastery-btn"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
