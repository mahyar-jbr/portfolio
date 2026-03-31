import {
  SiPython, SiJavascript, SiTypescript, SiReact, SiNodedotjs, SiExpress,
  SiFastapi, SiMongodb, SiPostgresql, SiSqlite, SiSqlalchemy, SiDocker,
  SiGithubactions, SiVercel, SiVite,
} from 'react-icons/si';
import { FaDatabase, FaLock, FaTrain, FaFilePdf, FaProjectDiagram } from 'react-icons/fa';

const techIcons = {
  'Python': SiPython,
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'React': SiReact,
  'React Native': SiReact,
  'Node.js': SiNodedotjs,
  'Express': SiExpress,
  'FastAPI': SiFastapi,
  'MongoDB': SiMongodb,
  'PostgreSQL': SiPostgresql,
  'SQLite': SiSqlite,
  'SQLAlchemy': SiSqlalchemy,
  'SQL': FaDatabase,
  'Docker': SiDocker,
  'GitHub Actions': SiGithubactions,
  'Vercel': SiVercel,
  'Vite': SiVite,
  'Railway': FaTrain,
  'JWT + BCrypt': FaLock,
  'jsPDF': FaFilePdf,
  'ER Modeling': FaProjectDiagram,
};

export default techIcons;
