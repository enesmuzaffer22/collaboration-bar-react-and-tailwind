import { useEffect, useState, useMemo, useRef } from "react";
import style from "./style.module.scss";

function CollabBar() {
  // Define the logos to be displayed in the slider with their src and href properties
  const logos = useMemo(
    () => [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Ford-Motor-Company-Logo.png",
        href: "https://www.ford.com/",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/1/13/Kia-logo.png",
        href: "https://www.kia.com/",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        href: "https://microsoft.com/",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/tr/b/b1/Puma_Logo.png",
        href: "https://puma.com/",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/1024px-Udemy_logo.svg.png",
        href: "https://www.udemy.com/",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        href: "https://google.com/",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/d/de/AsusTek-black-logo.png",
        href: "https://www.asus.com/",
      },
    ],
    []
  );

  // State to hold the extended logos for a smooth scrolling effect
  const [extendedLogos, setExtendedLogos] = useState([]);
  // State to track the width of the slider container
  const [barWidth, setBarWidth] = useState(window.innerWidth);
  // State to store calculated dimensions of each logo image
  const [imageDimensions, setImageDimensions] = useState([]);
  // Reference for the slider element
  const sliderRef = useRef(null);
  // State to pause/resume the animation on hover
  const [isPaused, setIsPaused] = useState(false);
  // State to keep track of the current position of the slider
  const [currentOffset, setCurrentOffset] = useState(0);

  // Effect to load images and calculate their dimensions when the component mounts
  useEffect(() => {
    const loadImages = async () => {
      const dimensions = await Promise.all(
        logos.map((logo) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = logo.src;

            img.onload = () => {
              const aspectRatio = img.width / img.height; // Calculate aspect ratio of the image
              const targetHeight = 36; // Set target height for the logos
              const calculatedWidth = targetHeight * aspectRatio; // Calculate the width based on aspect ratio

              resolve({
                ...logo,
                width: calculatedWidth,
                height: targetHeight,
              });
            };
          });
        })
      );
      setImageDimensions(dimensions); // Save the calculated dimensions
    };

    loadImages();
  }, [logos]);

  // Effect to update the slider width when the window resizes
  useEffect(() => {
    const handleResize = () => setBarWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to generate the extended logos for smooth scrolling
  useEffect(() => {
    if (imageDimensions.length > 0) {
      let logoLayoutSize = 0;
      for (let i = 0; i < imageDimensions.length; i++) {
        logoLayoutSize += imageDimensions[i].width; // Calculate total width of all logos
      }

      logoLayoutSize += imageDimensions.length * 64; // Add padding to the total width

      const logosToFill = Math.ceil((barWidth * 1.5) / logoLayoutSize) * 10; // Calculate the number of logos needed to fill the slider

      const repeatedLogos = [];
      for (let i = 0; i < logosToFill; i++) {
        repeatedLogos.push(...imageDimensions); // Duplicate the logos as needed
      }

      setExtendedLogos(repeatedLogos); // Update the extended logos state
    }
  }, [barWidth, imageDimensions]);

  // Event handler for mouse enter: pauses the animation
  const handleMouseEnter = () => {
    if (sliderRef.current) {
      const offset = sliderRef.current.getBoundingClientRect().left;
      setCurrentOffset(offset); // Save the current position
      setIsPaused(true); // Pause the animation
    }
  };

  // Event handler for mouse leave: resumes the animation
  const handleMouseLeave = () => {
    setIsPaused(false); // Resume the animation
  };

  return (
    <div
      className={`${style.slider} w-[70%] h-[88px] overflow-hidden relative border-2`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-start w-full h-full slider-track">
        <div
          ref={sliderRef}
          className={`${style.scrollAnimation} ${
            isPaused ? style.paused : ""
          } flex items-center gap-16`}
          style={{
            transform: isPaused
              ? `translateX(${currentOffset}px)` // Maintain the current position while paused
              : "translateX(0)", // Reset position when animation resumes
          }}
        >
          {extendedLogos.map((logo, index) => (
            <a
              key={index}
              alt={index}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "max-content" }}
            >
              <img
                src={logo.src}
                alt={`Logo ${index}`}
                style={{ width: "auto", height: logo.height }} // Set logo dimensions
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollabBar;
