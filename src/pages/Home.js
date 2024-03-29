import React from 'react';
import '../CSS/Paralax.css';
import '../CSS/Home.css';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */

/**
 * Home page containing content on the dangers that face the Pangolin species.
 * @returns {JSX.Element}
 * @constructor
 */
function Home() {
    return (
        <div className="home">
            <div className="parallax"/>
                <div className="homeContent">
                        <h1>Species Under Threat</h1>
                        <p><b>Although large predators, starvation, fires and possibly disease pose a threat to wild pangolins, the vast majority of threats facing pangolins today are of a human origin: </b></p>
                        <div className="homeBox1">
                                <h2>Domestic Trade</h2>
                                <p>Domestic trade probably poses the largest threat to African pangolins at present, although the illegal international trade is rapidly emerging as a major threat. All four African pangolin species are widely used in Traditional African Medicines, known locally as Muthi. Some cultures believe that pangolins are the greatest gift that can be bestowed on a person of authority and in the past many pangolins were presented to tribal chiefs and minsters as a sign of respect. This tradition is still practiced in some parts of Africa. There are also a number of traditional beliefs regarding pangolins. Some cultures believe that seeing a pangolin during the day indicates that a drought is imminent, and the only way to ward off the drought is to sacrifice the pangolin next to a river. Other cultures use pangolin fat to ward off evil spirits while still others believe that carrying a pangolin scale or a vial of pangolin blood will protect you from danger. Some cultures use pangolin scales as part of their traditional dress. In Central and West Africa pangolins are predominantly used as a source of food. Many villagers in these areas view pangolins as just another variety of protein or bushmeat, and they are hunted as such. Some cultures hold pangolin meat in high esteem and serve pangolin meat to dignitaries or on special occasions. After being captured and killed, the pangolins are roasted over a fire or boiled to remove the scales, which are discarded, and the meat preserved.</p>
                        </div>
                        <div className="homeBox2">
                                <h2>International trade</h2>
                                <p>Until recently the international trade has focused predominantly on the Asian pangolin species. The recent precipitous decline in these populations and the challenges facing law enforcement in Africa, in combination with increased trade agreements between Africa and Asia, has resulted in the African pangolin species being increasingly targeted to supply the insatiable Asian demand. Most of these animals and derivatives are destined for China and Vietnam, although significant seizures have also been made in various European countries. China and Vietnam are believed to be the main end-user countries with the European countries mainly acting as conduits, although some of the pangolins imported into Europe as bushmeat are destined for expatriate communities living in these countries. The illegal international trade is likely to become the most significant threat to African pangolin species in the near-future. </p>
                        </div>
                        <div className="homeBox1">
                                <h2>Habitat loss </h2>
                                <p>Habitat loss is a significant threat to pangolins - across Africa. With the burgeoning human population, there is an ever-increasing number of people relying on an ever-dwindling supply of natural resources. In addition to this, improved logistics and infrastructure are also contributing to the demise of endangered species. For example, a new road that is built does not just fragment the habitat, it also brings more people to the area because that area is now more accessible. Areas that were previously inaccessible become easily accessible, with a transport network nearby to transport any harvested resources, with the result that this area becomes over-utilized. Mines, agriculture and settlements result in significant habitat loss – especially in West and Central Africa. The best way to conserve these habitats, and thus pangolins and other threatened species, is by supporting local ecotourism ventures. Sangha Lodge and Chinko Project are doing great work in the Central African Republic, as are Wilderness Safaris and African Parks in various African countries. Please consider supporting these, and other, local environmental initiatives. </p>
                        </div>
                        <div className="homeBox2">
                                <h2>Electrified fences</h2>
                                <p>Electrified fences pose a significant threat to pangolins, especially in southern Africa where these structures are ever-present. It is estimated that between 440 and 1 190 pangolins are inadvertently killed on electrified fences in southern Africa every year: that is one pangolin electrocuted per 10–30 km of electrified fence per year. These electrocutions are accidental and relate to the pangolin’s behaviour of walking on its hind legs with the front legs and tail held off the ground and acting as a counter-balance. The belly is not protected by scales and when the pangolin’s belly comes into contact with an electrified wire the shock is perceived as a threat. Pangolins only have one defence when faced with a threat – and that is to roll into a ball, often inadvertently curling around the electrified wire in the process. Each successive shock causes the trapped pangolin to curl ever-tighter around the wire until it succumbs to either electrocution or exposure. We are conducting research to improve electrified fence designs to make them more pangolin-friendly, while maintaining their overall effectiveness. One such design change is to raise the height of the lowest electrified strand to at least 40 cm above the ground. Unfortunately, this means that many carnivores, including damage-causing predators, can crawl underneath the electrified wire and thus it is not suitable for game farms with predators or livestock farms that suffer high livestock predation rates. Another design that has shown promise is to modify the offset tripwire to include three strands (live : earth : live), with the lowest tripwire set at about 5 cm above the ground and the highest strand set at 30–40 cm. Initial tests with this design resulted in a more than 30% reduction in mortalities, although further research is required.</p>
                        </div>
                </div>
            </div>
    )
}
export default Home;