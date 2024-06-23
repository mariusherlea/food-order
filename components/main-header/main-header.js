import Image from "next/image";
import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";

export default function MainHeader() {
  console.log("MainHeader");
  return (
    <header className={classes.header}>
      <Link className={classes.logo} href="/">
        <Image src={logoImg} alt="A table full of delicious food." priority />{" "}
        Nextjs Food
      </Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            <Link href="/meals">Browse meals</Link>
          </li>
          <li>
            <Link href="/community">Foodies Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
