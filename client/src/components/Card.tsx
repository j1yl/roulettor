import Link from "next/link";
import React from "react";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cta: string;
  ctalink: string;
  live: boolean;
};

const Card = (props: Props) => {
  const { title, description, image, imageAlt, cta, ctalink, live } = props;

  return (
    <div className="card w-full bg-base-300">
      <figure>
        <Image
          src={`/${image}`}
          width={1600}
          height={900}
          alt={imageAlt}
          className="aspect-video"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          {live ? (
            <Link href={`${ctalink}`} className="btn-primary btn">
              {cta}
            </Link>
          ) : (
            <Link href={`${ctalink}`} className="btn-disabled btn">
              {cta}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
