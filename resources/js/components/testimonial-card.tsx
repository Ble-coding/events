interface TestimonialCardProps {
    content: string;
    author: string;
    role: string;
    avatarSrc?: string;
  }

  const TestimonialCard = ({ content, author, role, avatarSrc }: TestimonialCardProps) => {
    return (
        <div className="bg-white dark:bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-guilo-orange flex items-center justify-center text-white">
              {avatarSrc ? (
                <img src={avatarSrc} alt={author} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{author.charAt(0)}</span>
              )}
            </div>
            <div className="ml-4">
              <h4 className="font-bold paragraph">{author}</h4>
              <p className="text-sm paragraph">{role}</p>
            </div>
          </div>
          <blockquote>
            <p className="italic paragraph">"{content}"</p>
          </blockquote>
        </div>
      );

  };

  export default TestimonialCard;
