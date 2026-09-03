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
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '60px 20px', color: 'white', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
      <SeoHead
        title={seoData.mastery.title}
        description={seoData.mastery.description}
        canonical={seoData.mastery.canonical}
        keywords={seoData.mastery.keywords}
        jsonLd={seoData.mastery.jsonLd}
      />
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        
        <div style={{ fontSize: '72px', margin: '0 0 24px' }}>🎓</div>
        
        <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 16px', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master of Crystallography
        </h1>
        
        <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '40px', lineHeight: '1.6' }}>
          Congratulations! You have successfully completed the rigorous training program, demonstrating exceptional understanding of Miller indices, reciprocal space, and crystal planes.
        </p>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>
          <h3 style={{ margin: '0 0 16px', color: '#94a3b8', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Final Credentials</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#38bdf8' }}>{levelInfo.level}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Final Level</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7' }}>{totalXP}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Total XP</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{progress.gameStats.maxStreak}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Max Streak</div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          style={{ padding: '16px 32px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
