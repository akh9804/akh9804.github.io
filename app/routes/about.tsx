import {useMemo} from 'react';

export default function About() {
  const skills = useMemo(() => ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'Node.js'], []);
  const experiences = useMemo(
    () => [
      {
        company: 'Kakao',
        period: '2021.09 ~ 현재',
        projects: [
          '커머스 프로모션 페이지 노코드 빌더 개발',
          '커머스 공통 라이브러리 개발, 서버 관리',
          '<strong>부분 렌더링 디렉티브</strong>를 통한 서비스 페이지 렌더링 성능 최적화',
          '성능 최적화를 통한 <strong>lighthouse 성능 점수 80</strong> 이상 달성',
          '파트 코드 컨벤션 강화를 위한 <strong>Eslint 플러그인</strong> 개발',
          'Angular 파일 생성 CLI 개선을 통한 개발 생산성 향상',
        ],
        tags: ['Angular', 'TypeScript', 'Node.js', 'Lerna', 'Nx'],
      },
      {
        company: 'KakaoCommerce',
        period: '2021.05 ~ 2021.08',
        projects: ['커머스 공통 라이브러리 개발', '라이브러리 <strong>자동 마이그레이션 스크립트</strong> 개발'],
        tags: ['Angular', 'TypeScript', 'Node.js'],
      },
      {
        company: 'Estsoft',
        period: '2020.12 ~ 2021.04',
        projects: ['웹 채팅 애플리케이션 개발'],
        tags: ['Angular', 'TypeScript', 'Node.js'],
      },
    ],
    [],
  );
  const projects = [
    {
      title: 'pattern.dev 번역 및 검수 활동 참여',
      description: '프론트엔드 개발자를 위한 패턴 소개 사이트',
      link: 'https://patterns-dev-kr.github.io/',
    },
    {
      title: 'es-cookie 오픈소스 컨트리뷰트',
      description: '쿠키 관리 라이브러리',
      link: 'https://github.com/es-cookie/es-cookie',
    },
  ];

  return (
    <div>
      <section>
        <p>안녕하세요. 웹 프론트엔드 개발자 안광훈입니다.</p>
        <br />
        <p>
          문제를 깊게 고민하고 해결하는 것을 지향하고 좋아합니다. 다양한 프로젝트에서 성능 최적화, 코드 품질 향상, 개발
          프로세스 개선 등의 경험을 쌓아왔습니다.
        </p>
        <br />
        <p>
          Angular 기반 패키지의 개발, 배포 및 운영 경험이 있으며, Node.js를 활용한 CLI 도구 개발과 자동화 경험이
          있습니다.
        </p>
      </section>
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold leading-[1.6] text-[var(--color-primary)] shadow-[0_4px_0_0_var(--color-primary)] inline-block">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={skill}
              className="py-1 px-2 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-primary)] text-xs transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold leading-[1.6] text-[var(--color-primary)] shadow-[0_4px_0_0_var(--color-primary)] inline-block">
          Experiences
        </h2>
        {experiences.map(({company, period, projects, tags}) => (
          <article className="mt-4 mx-0 mb-6">
            <h3 className="mb-1 text-lg font-bold leading-[1.6] text-[#543a14e3]">
              {company} ({period})
            </h3>
            <ul className="text-base leading-[1.75] relative left-5 list-disc">
              {projects.map(project => (
                <li
                  key={project}
                  className="marker:text-[var(--color-primary)]"
                  dangerouslySetInnerHTML={{__html: project}}
                ></li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="py-1 px-2 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-primary)] text-xs transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold leading-[1.6] text-[var(--color-primary)] shadow-[0_4px_0_0_var(--color-primary)] inline-block">
          Projects
        </h2>
        {projects.map(project => (
          <article
            key={project.title}
            className="py-6 px-4 rounded-2xl shadow-sm mt-4 mb-6 bg-[#f7f2ec] hover:scale-102 transition-transform duration-300 ease-in-out"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--color-primary)]">
                {project.title}{' '}
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  🔗
                </a>
              </h2>
              <p className="text-sm text-gray-700">{project.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
