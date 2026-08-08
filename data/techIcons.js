import {
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiTypescript,
  SiFastapi, SiPython, SiPydantic, SiMongodb, SiSqlite,
  SiPostgresql, SiDocker, SiGooglegemini,
} from 'react-icons/si';
import { FaBrain } from 'react-icons/fa6';

// Maps a tech label (as used in data/projects.js) to its icon component.
const techIcons = {
  'React': SiReact,
  'React Native': SiReact,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'Express': SiExpress,
  'TypeScript': SiTypescript,
  'FastAPI': SiFastapi,
  'Python': SiPython,
  'Pydantic': SiPydantic,
  'MongoDB': SiMongodb,
  'MongoDB Atlas': SiMongodb,
  'SQLite': SiSqlite,
  'PostgreSQL': SiPostgresql,
  'Docker': SiDocker,
  'Gemini': SiGooglegemini,
  'LangGraph': FaBrain, // no official icon; brain glyph for the agent framework
};

export default techIcons;
