import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import LicenseLogo from "src/assets/logos/license.png";
import { linkStyle } from "src/assets/style/tableStyle";
import { useTitle } from "src/hooks/useTitle";
import { PageContainer } from "src/layout/PageContainer";

export function LicensePage() {
    useTitle("Lisens")
    return (
        <PageContainer>
            <div style={{ maxWidth: "600px", marginInline: "auto" }}>
                <Introduction />
                <Divider sx={{ my: 5 }} />
                <License />
            </div>
        </PageContainer>
    )
}

export function LicenseOnlyPage() {
    useTitle("Måkesodd")
    return (
        <PageContainer>
            <div style={{ maxWidth: "600px", marginInline: "auto" }}>
                <License />
            </div>
        </PageContainer>
    )
}

function Introduction() {
    return (
        <>
            <h1>Lisens</h1>
            <p>
                Denne nettsiden er et <em>åpen-kildekode-prosjekt</em> og er lisensiert under Motstanden sin egen lisens: <strong>MÅKESODD v1</strong>
            </p>
            <p>
                På
                {" "}
                <Link
                    href="https://github.com/Motstanden"
                    underline="hover"
                    sx={linkStyle}>
                    Motstanden sin github
                </Link>
                {" "}
                kan du finne
                {" "}
                <Link
                    href="https://github.com/Motstanden/motstanden-website"
                    underline="hover"
                    sx={linkStyle}>
                    kildekoden for denne nettsiden
                </Link>.
            </p>
            <p>
                <strong>MÅKESODD v1</strong> kan leses i sin helhet i avsnittet under.
            </p>
        </>
    )
}

function License() {
    return (
        <pre style={{ whiteSpace: "pre-wrap" }} >
            <div style={{ textAlign: "center" }}>
                <h1 style={{ margin: 0 }}>MÅKESODD v1</h1>
                <img
                    src={LicenseLogo}
                    style={{
                        maxWidth: "300px",
                        width: "95%",
                        marginBlock: "20px"
                    }} />
                <h3>Motstandens Åpne Kildekodelisens egnet Studentorchesterets Diverse Dataprosjekter</h3>
            </div>
            <p>
                Copyright (c) 2022, Studentorchesteret den Ohmske Motstanden
                All rights reserved. MÅKESODD 4-klausulslisens, versjon 1.
            </p>
            <p>
                Formålet med lisensen er å hindre at kildekoden videreutvikles uten at
                Studentorchesteret den Ohmske Motstanden, heretter Motstanden, kan dra nytte av
                endringene, samt at Motstandens medlemmer ikke begrenses av lisensen dersom de
                ønsker å gjenbruke kildekode fra et Motstanden-prosjekt i sine egne eller
                andres prosjekter.
            </p>
            <p>
                Redistribusjon av kildekode og binærfiler, med eller uten modifikasjon,
                er tillatt så lenge følgende klausuler overholdes:
            </p>
            <ol>
                <li>
                    Redistribusjon av kildekoden og/eller binærfiler må inneholde dette
                    lisensdokumentet MÅKESODD versjon 1, eller en senere versjon av MÅKESODD.
                </li>
                <li>
                    Dersom Motstanden etterspør kildekoden skal den utleveres.
                </li>
                <li>
                    Kun Motstanden-styret kan legge til navn i den offisielle bidragsyterlista.
                </li>
                <li>
                    Personene som er nevnt i den offisielle bidragsyterlista unntas fra
                    bestemmelsen i klausul 1, og kan fritt redistribuere kildekoden, under
                    MÅKESODD, under annen, valgfri lisens, eller uten lisens.
                </li>
            </ol>
            <h2>
                OFFISIELL BIDRAGSYTERLISTE
            </h2>
            <ul>
                <li>
                    Torstein Wilhelmsen Sandvik (lagt til 02/09-2022 av Motstanden)
                </li>
            </ul>
            {/* <Divider sx={{my: 4}} light/> */}
            <p style={{ marginTop: "60px" }}>
                THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS &quot;AS IS&quot; 
                AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
                IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
                DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
                FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
                DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
                SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
                CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
                OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
                OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
        </pre>
    )
}