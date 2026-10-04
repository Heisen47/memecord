import React, { useEffect, useState } from 'react';
import { Search, X, RefreshCw, Sparkles, Flame, Check } from 'lucide-react';
import { GestureType } from '../shared/types';

interface MemeApiModalProps {
  gestureKey: Exclude<GestureType, 'none'>;
  gestureName: string;
  onSelect: (assetUrl: string, title: string) => void;
  onClose: () => void;
}

interface ImgflipMeme {
  id: string;
  name: string;
  url: string;
}

interface RedditMeme {
  title: string;
  url: string;
  postLink: string;
}

export const MemeApiModal: React.FC<MemeApiModalProps> = ({
  gestureKey,
  gestureName,
  onSelect,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'fresh'>('templates');
  const [templates, setTemplates] = useState<ImgflipMeme[]>([]);
  const [freshMemes, setFreshMemes] = useState<RedditMeme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://api.imgflip.com/get_memes');
      const json = await res.json();
      if (json.success && json.data?.memes) {
        setTemplates(json.data.memes);
      } else {
        throw new Error('Failed to load meme templates');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading memes from API');
    } finally {
      setLoading(false);
    }
  };

  const fetchFreshMemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://meme-api.com/gimme/20');
      const json = await res.json();
      if (json.memes) {
        // filter image urls only
        const valid = json.memes.filter((m: any) =>
          m.url && (m.url.endsWith('.png') || m.url.endsWith('.jpg') || m.url.endsWith('.jpeg') || m.url.endsWith('.gif'))
        );
        setFreshMemes(valid);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching fresh memes');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'templates' | 'fresh') => {
    setActiveTab(tab);
    if (tab === 'fresh' && freshMemes.length === 0) {
      fetchFreshMemes();
    }
  };

  const filteredTemplates = templates.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="api-modal-overlay" onClick={onClose}>
      <div className="api-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="api-modal-header">
          <div>
            <h2 className="api-modal-title">Online Meme Explorer</h2>
            <div className="api-modal-sub">
              Binding to <strong>{gestureName}</strong>
            </div>
          </div>
          <button className="api-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="api-tabs">
          <button
            className={`api-tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => handleTabChange('templates')}
          >
            <Flame size={13} />
            Top 100 Templates
          </button>
          <button
            className={`api-tab ${activeTab === 'fresh' ? 'active' : ''}`}
            onClick={() => handleTabChange('fresh')}
          >
            <Sparkles size={13} />
            Fresh Memes
          </button>
        </div>

        {/* Search Bar / Refresh */}
        <div className="api-toolbar">
          {activeTab === 'templates' ? (
            <div className="api-search-input-wrap">
              <Search size={13} className="api-search-icon" />
              <input
                type="text"
                placeholder="Search templates (e.g. Drake, Spider-Man)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button
                  className="api-search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ) : (
            <button
              className="api-refresh-btn"
              onClick={fetchFreshMemes}
              disabled={loading}
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
              Load 20 More Fresh Memes
            </button>
          )}
        </div>

        {/* Status / Error */}
        {error && <div className="api-error">{error}</div>}

        {loading && (
          <div className="api-loading">
            <RefreshCw size={20} className="spin" />
            <span>Fetching memes from API...</span>
          </div>
        )}

        {/* Memes Grid */}
        {!loading && (
          <div className="api-grid">
            {activeTab === 'templates' &&
              filteredTemplates.map((meme) => (
                <div
                  key={meme.id}
                  className="api-meme-card"
                  onClick={() => onSelect(meme.url, meme.name)}
                >
                  <div className="api-meme-img-wrap">
                    <img src={meme.url} alt={meme.name} loading="lazy" />
                  </div>
                  <div className="api-meme-title" title={meme.name}>
                    {meme.name}
                  </div>
                </div>
              ))}

            {activeTab === 'fresh' &&
              freshMemes.map((meme, idx) => (
                <div
                  key={idx}
                  className="api-meme-card"
                  onClick={() => onSelect(meme.url, meme.title)}
                >
                  <div className="api-meme-img-wrap">
                    <img src={meme.url} alt={meme.title} loading="lazy" />
                  </div>
                  <div className="api-meme-title" title={meme.title}>
                    {meme.title}
                  </div>
                </div>
              ))}

            {activeTab === 'templates' && filteredTemplates.length === 0 && (
              <div className="api-empty">No memes found matching "{searchTerm}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
