import { Illustration, type IllustrationProps } from "@/components/liniqo/illustration"

const art = `<g fill="none" stroke-linejoin="round" stroke-linecap="round"><path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.1" data-role="decor" d="M455.0,181.3 L406.0,209.6 M455.0,181.3 L504.0,209.6"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.1" data-role="decor" d="M406.0,209.6 L356.9,237.9 M504.0,209.6 L455.0,237.9 M602.1,1172.2 L553.1,1200.5 M504.0,209.6 L553.1,237.9 M406.0,209.6 L455.0,237.9 M504.0,1172.2 L553.1,1200.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.2" data-role="decor" d="M356.9,237.9 L307.9,266.2 M553.1,1143.9 L504.0,1172.2 M651.1,1143.9 L602.1,1172.2 M356.9,237.9 L406.0,266.2 M553.1,1143.9 L602.1,1172.2 M455.0,1143.9 L504.0,1172.2"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.2" data-role="decor" d="M307.9,266.2 L258.9,294.5 M-231.4,634.3 L-280.4,662.6 M1288.6,662.6 L1239.6,690.9 M1288.6,719.2 L1239.6,747.5 M700.2,1115.5 L651.1,1143.9 M1239.6,634.3 L1288.6,662.6 M1239.6,690.9 L1288.6,719.2 M1239.6,747.5 L1288.6,775.8 M-280.4,606.0 L-231.4,634.3"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.3" data-role="decor" d="M258.9,294.5 L209.8,322.8 M-182.4,606.0 L-231.4,634.3 M504.0,266.2 L455.0,294.5 M1239.6,634.3 L1190.5,662.6 M1239.6,747.5 L1190.5,775.8 M749.2,1087.2 L700.2,1115.5 M1190.5,606.0 L1239.6,634.3 M504.0,266.2 L553.1,294.5 M1190.5,775.8 L1239.6,804.1 M-231.4,577.6 L-182.4,606.0"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.4" data-role="decor" d="M209.8,322.8 L160.8,351.2 M-84.3,492.7 L-133.3,521.0 M356.9,294.5 L307.9,322.8 M-182.4,662.6 L-231.4,690.9 M651.1,1087.2 L602.1,1115.5 M798.3,1058.9 L749.2,1087.2 M651.1,294.5 L700.2,322.8 M-182.4,549.3 L-133.3,577.6 M-231.4,690.9 L-182.4,719.2 M356.9,1087.2 L406.0,1115.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.4" data-role="decor" d="M160.8,351.2 L111.8,379.5 M-133.3,577.6 L-182.4,606.0 M455.0,294.5 L406.0,322.8 M651.1,294.5 L602.1,322.8 M455.0,1087.2 L406.0,1115.5 M553.1,1087.2 L504.0,1115.5 M1141.5,860.7 L1092.5,889.1 M1141.5,577.6 L1190.5,606.0 M553.1,294.5 L602.1,322.8 M356.9,294.5 L406.0,322.8 M1141.5,804.1 L1190.5,832.4 M209.8,322.8 L258.9,351.2 M553.1,1087.2 L602.1,1115.5 M455.0,1087.2 L504.0,1115.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.4" data-role="decor" d="M111.8,379.5 L62.7,407.8 M13.7,436.1 L-35.3,464.4 M-35.3,464.4 L-84.3,492.7 M553.1,294.5 L504.0,322.8 M1190.5,606.0 L1141.5,634.3 M1190.5,775.8 L1141.5,804.1 M847.3,1030.6 L798.3,1058.9 M1141.5,634.3 L1190.5,662.6 M455.0,294.5 L504.0,322.8 M1141.5,747.5 L1190.5,775.8 M-133.3,521.0 L-84.3,549.3 M700.2,1058.9 L749.2,1087.2 M-182.4,606.0 L-133.3,634.3 M-182.4,775.8 L-133.3,804.1"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.4" data-role="decor" d="M62.7,407.8 L13.7,436.1 M307.9,322.8 L258.9,351.2 M-133.3,634.3 L-182.4,662.6 M-133.3,747.5 L-182.4,775.8 M1190.5,662.6 L1141.5,690.9 M1190.5,719.2 L1141.5,747.5 M700.2,1058.9 L651.1,1087.2 M1092.5,889.1 L1043.4,917.4 M700.2,322.8 L749.2,351.2 M1092.5,549.3 L1141.5,577.6 M1141.5,690.9 L1190.5,719.2 M1092.5,832.4 L1141.5,860.7 M160.8,351.2 L209.8,379.5 M307.9,1058.9 L356.9,1087.2"/>



<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.3" data-role="decor" d="M-133.3,521.0 L-182.4,549.3 M-182.4,719.2 L-231.4,747.5 M1239.6,690.9 L1190.5,719.2 M1190.5,832.4 L1141.5,860.7 M1190.5,662.6 L1239.6,690.9 M1190.5,719.2 L1239.6,747.5 M258.9,294.5 L307.9,322.8 M651.1,1087.2 L700.2,1115.5 M-231.4,634.3 L-182.4,662.6 M-231.4,747.5 L-182.4,775.8"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.3" data-role="decor" d="M-182.4,549.3 L-231.4,577.6 M-231.4,690.9 L-280.4,719.2 M307.9,266.2 L356.9,294.5 M602.1,1115.5 L651.1,1143.9 M-280.4,662.6 L-231.4,690.9 M-280.4,719.2 L-231.4,747.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.2" data-role="decor" d="M-231.4,577.6 L-280.4,606.0 M455.0,237.9 L406.0,266.2 M553.1,237.9 L504.0,266.2 M1288.6,775.8 L1239.6,804.1 M553.1,237.9 L602.1,266.2 M455.0,237.9 L504.0,266.2"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.2" data-role="decor" d="M-280.4,606.0 L-329.5,634.3 M1337.6,747.5 L1288.6,775.8 M1288.6,662.6 L1337.6,690.9 M1288.6,719.2 L1337.6,747.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.1" data-role="decor" d="M-329.5,634.3 L-378.5,662.6 M1386.7,719.2 L1337.6,747.5 M1337.6,690.9 L1386.7,719.2"/>


<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.3" data-role="decor" d="M406.0,266.2 L356.9,294.5 M602.1,266.2 L553.1,294.5 M504.0,1115.5 L455.0,1143.9 M602.1,1115.5 L553.1,1143.9 M1239.6,804.1 L1190.5,832.4 M602.1,266.2 L651.1,294.5 M406.0,266.2 L455.0,294.5 M504.0,1115.5 L553.1,1143.9 M406.0,1115.5 L455.0,1143.9"/>


<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.5" data-role="decor" d="M258.9,351.2 L209.8,379.5 M406.0,322.8 L356.9,351.2 M602.1,322.8 L553.1,351.2 M1141.5,577.6 L1092.5,606.0 M504.0,1058.9 L455.0,1087.2 M602.1,1058.9 L553.1,1087.2 M1141.5,804.1 L1092.5,832.4 M994.4,945.7 L945.4,974.0 M749.2,351.2 L798.3,379.5 M1043.4,521.0 L1092.5,549.3 M602.1,322.8 L651.1,351.2 M1043.4,860.7 L1092.5,889.1 M111.8,379.5 L160.8,407.8 M62.7,407.8 L111.8,436.1 M-35.3,464.4 L13.7,492.7 M-133.3,577.6 L-84.3,606.0 M504.0,1058.9 L553.1,1087.2 M406.0,1058.9 L455.0,1087.2 M-133.3,804.1 L-84.3,832.4"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.5" data-role="decor" d="M209.8,379.5 L160.8,407.8 M-84.3,606.0 L-133.3,634.3 M1092.5,549.3 L1043.4,577.6 M356.9,1030.6 L307.9,1058.9 M1141.5,634.3 L1092.5,662.6 M1141.5,690.9 L1092.5,719.2 M1141.5,747.5 L1092.5,775.8 M1092.5,832.4 L1043.4,860.7 M798.3,379.5 L847.3,407.8 M994.4,492.7 L1043.4,521.0 M1092.5,662.6 L1141.5,690.9 M1092.5,719.2 L1141.5,747.5 M258.9,351.2 L307.9,379.5 M994.4,889.1 L1043.4,917.4 M945.4,917.4 L994.4,945.7 M847.3,974.0 L896.3,1002.3 M651.1,1030.6 L700.2,1058.9 M-133.3,634.3 L-84.3,662.6 M-133.3,747.5 L-84.3,775.8"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.5" data-role="decor" d="M160.8,407.8 L111.8,436.1 M62.7,464.4 L13.7,492.7 M13.7,492.7 L-35.3,521.0 M356.9,351.2 L307.9,379.5 M-84.3,662.6 L-133.3,690.9 M-84.3,719.2 L-133.3,747.5 M651.1,1030.6 L602.1,1058.9 M798.3,1002.3 L749.2,1030.6 M847.3,407.8 L896.3,436.1 M896.3,436.1 L945.4,464.4 M945.4,464.4 L994.4,492.7 M651.1,351.2 L700.2,379.5 M896.3,945.7 L945.4,974.0 M-84.3,549.3 L-35.3,577.6 M-133.3,690.9 L-84.3,719.2 M356.9,1030.6 L406.0,1058.9 M-84.3,832.4 L-35.3,860.7 M209.8,1002.3 L258.9,1030.6"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.5" data-role="decor" d="M111.8,436.1 L62.7,464.4 M651.1,351.2 L602.1,379.5 M-35.3,804.1 L-84.3,832.4 M798.3,379.5 L749.2,407.8 M1043.4,521.0 L994.4,549.3 M455.0,1030.6 L406.0,1058.9 M553.1,1030.6 L504.0,1058.9 M1043.4,860.7 L994.4,889.1 M1043.4,577.6 L1092.5,606.0 M356.9,351.2 L406.0,379.5 M1043.4,804.1 L1092.5,832.4 M209.8,379.5 L258.9,407.8 M553.1,1030.6 L602.1,1058.9 M455.0,1030.6 L504.0,1058.9"/>


<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.5" data-role="decor" d="M-35.3,521.0 L-84.3,549.3 M504.0,322.8 L455.0,351.2 M-84.3,775.8 L-133.3,804.1 M749.2,351.2 L700.2,379.5 M749.2,1030.6 L700.2,1058.9 M1092.5,606.0 L1141.5,634.3 M504.0,322.8 L553.1,351.2 M406.0,322.8 L455.0,351.2 M1092.5,775.8 L1141.5,804.1 M13.7,436.1 L62.7,464.4 M798.3,1002.3 L847.3,1030.6 M258.9,1030.6 L307.9,1058.9"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.4" data-role="decor" d="M-84.3,549.3 L-133.3,577.6 M-133.3,690.9 L-182.4,719.2 M700.2,322.8 L651.1,351.2 M406.0,1058.9 L356.9,1087.2 M1043.4,917.4 L994.4,945.7 M945.4,974.0 L896.3,1002.3 M896.3,1002.3 L847.3,1030.6 M307.9,322.8 L356.9,351.2 M-84.3,492.7 L-35.3,521.0 M749.2,1030.6 L798.3,1058.9 M602.1,1058.9 L651.1,1087.2 M-182.4,662.6 L-133.3,690.9 M-182.4,719.2 L-133.3,747.5"/>



<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.2" data-role="decor" d="M-280.4,662.6 L-329.5,690.9 M1337.6,690.9 L1288.6,719.2 M-329.5,634.3 L-280.4,662.6 M-329.5,690.9 L-280.4,719.2"/>





<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.6" data-role="decor" d="M307.9,379.5 L258.9,407.8 M896.3,436.1 L847.3,464.4 M945.4,464.4 L896.3,492.7 M994.4,492.7 L945.4,521.0 M1092.5,719.2 L1043.4,747.5 M700.2,1002.3 L651.1,1030.6 M945.4,917.4 L896.3,945.7 M896.3,945.7 L847.3,974.0 M700.2,379.5 L749.2,407.8 M994.4,549.3 L1043.4,577.6 M1043.4,634.3 L1092.5,662.6 M1043.4,747.5 L1092.5,775.8 M994.4,832.4 L1043.4,860.7 M160.8,407.8 L209.8,436.1 M13.7,492.7 L62.7,521.0 M-84.3,606.0 L-35.3,634.3 M-84.3,775.8 L-35.3,804.1 M13.7,889.1 L62.7,917.4 M62.7,917.4 L111.8,945.7 M111.8,945.7 L160.8,974.0"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.6" data-role="decor" d="M258.9,407.8 L209.8,436.1 M406.0,379.5 L356.9,407.8 M62.7,860.7 L13.7,889.1 M1043.4,577.6 L994.4,606.0 M406.0,1002.3 L356.9,1030.6 M602.1,1002.3 L553.1,1030.6 M1043.4,804.1 L994.4,832.4 M749.2,407.8 L798.3,436.1 M945.4,521.0 L994.4,549.3 M602.1,379.5 L651.1,407.8 M945.4,860.7 L994.4,889.1 M798.3,945.7 L847.3,974.0 M602.1,1002.3 L651.1,1030.6 M-35.3,804.1 L13.7,832.4"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.7" data-role="decor" d="M209.8,436.1 L160.8,464.4 M62.7,521.0 L13.7,549.3 M602.1,379.5 L553.1,407.8 M111.8,889.1 L62.7,917.4 M160.8,917.4 L111.8,945.7 M209.8,945.7 L160.8,974.0 M504.0,1002.3 L455.0,1030.6 M749.2,974.0 L700.2,1002.3 M798.3,436.1 L847.3,464.4 M847.3,464.4 L896.3,492.7 M896.3,492.7 L945.4,521.0 M994.4,606.0 L1043.4,634.3 M406.0,379.5 L455.0,407.8 M994.4,775.8 L1043.4,804.1 M896.3,889.1 L945.4,917.4 M847.3,917.4 L896.3,945.7 M-35.3,577.6 L13.7,606.0 M504.0,1002.3 L553.1,1030.6 M406.0,1002.3 L455.0,1030.6 M258.9,974.0 L307.9,1002.3"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.7" data-role="decor" d="M160.8,464.4 L111.8,492.7 M111.8,492.7 L62.7,521.0 M13.7,606.0 L-35.3,634.3 M504.0,379.5 L455.0,407.8 M13.7,775.8 L-35.3,804.1 M749.2,407.8 L700.2,436.1 M994.4,549.3 L945.4,577.6 M1043.4,634.3 L994.4,662.6 M1043.4,747.5 L994.4,775.8 M994.4,832.4 L945.4,860.7 M504.0,379.5 L553.1,407.8 M258.9,407.8 L307.9,436.1"/>


<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.6" data-role="decor" d="M13.7,549.3 L-35.3,577.6 M-35.3,634.3 L-84.3,662.6 M-35.3,690.9 L-84.3,719.2 M-35.3,747.5 L-84.3,775.8 M700.2,379.5 L651.1,407.8 M13.7,832.4 L-35.3,860.7 M258.9,974.0 L209.8,1002.3 M1092.5,662.6 L1043.4,690.9 M1043.4,690.9 L1092.5,719.2 M307.9,379.5 L356.9,407.8 M111.8,436.1 L160.8,464.4 M62.7,464.4 L111.8,492.7 M749.2,974.0 L798.3,1002.3 M-84.3,662.6 L-35.3,690.9 M-84.3,719.2 L-35.3,747.5 M307.9,1002.3 L356.9,1030.6"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.6" data-role="decor" d="M-35.3,577.6 L-84.3,606.0 M455.0,351.2 L406.0,379.5 M553.1,351.2 L504.0,379.5 M847.3,407.8 L798.3,436.1 M307.9,1002.3 L258.9,1030.6 M1092.5,606.0 L1043.4,634.3 M1092.5,775.8 L1043.4,804.1 M994.4,889.1 L945.4,917.4 M847.3,974.0 L798.3,1002.3 M553.1,351.2 L602.1,379.5 M455.0,351.2 L504.0,379.5 M-35.3,521.0 L13.7,549.3 M700.2,1002.3 L749.2,1030.6 M-35.3,860.7 L13.7,889.1 M160.8,974.0 L209.8,1002.3"/>









<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.7" data-role="decor" d="M356.9,407.8 L307.9,436.1 M13.7,662.6 L-35.3,690.9 M13.7,719.2 L-35.3,747.5 M798.3,436.1 L749.2,464.4 M945.4,521.0 L896.3,549.3 M651.1,974.0 L602.1,1002.3 M945.4,860.7 L896.3,889.1 M896.3,889.1 L847.3,917.4 M847.3,917.4 L798.3,945.7 M945.4,577.6 L994.4,606.0 M945.4,804.1 L994.4,832.4 M209.8,436.1 L258.9,464.4 M-35.3,690.9 L13.7,719.2 M356.9,974.0 L406.0,1002.3 M62.7,860.7 L111.8,889.1 M160.8,917.4 L209.8,945.7"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.8" data-role="decor" d="M307.9,436.1 L258.9,464.4 M455.0,407.8 L406.0,436.1 M553.1,407.8 L504.0,436.1 M994.4,606.0 L945.4,634.3 M994.4,775.8 L945.4,804.1 M700.2,436.1 L749.2,464.4 M896.3,549.3 L945.4,577.6 M553.1,407.8 L602.1,436.1 M455.0,407.8 L504.0,436.1 M896.3,832.4 L945.4,860.7 M455.0,974.0 L504.0,1002.3 M13.7,775.8 L62.7,804.1"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.8" data-role="decor" d="M258.9,464.4 L209.8,492.7 M160.8,521.0 L111.8,549.3 M62.7,634.3 L13.7,662.6 M62.7,747.5 L13.7,775.8 M700.2,436.1 L651.1,464.4 M160.8,860.7 L111.8,889.1 M209.8,889.1 L160.8,917.4 M994.4,662.6 L945.4,690.9 M994.4,719.2 L945.4,747.5 M945.4,804.1 L896.3,832.4 M798.3,492.7 L847.3,521.0 M847.3,521.0 L896.3,549.3 M945.4,690.9 L994.4,719.2 M307.9,436.1 L356.9,464.4 M798.3,889.1 L847.3,917.4 M13.7,719.2 L62.7,747.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.8" data-role="decor" d="M209.8,492.7 L160.8,521.0 M62.7,690.9 L13.7,719.2 M945.4,577.6 L896.3,606.0 M406.0,945.7 L356.9,974.0 M749.2,917.4 L700.2,945.7 M602.1,436.1 L651.1,464.4 M62.7,577.6 L111.8,606.0 M602.1,945.7 L651.1,974.0 M13.7,662.6 L62.7,690.9 M62.7,804.1 L111.8,832.4"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.8" data-role="decor" d="M111.8,549.3 L62.7,577.6 M111.8,832.4 L62.7,860.7 M258.9,917.4 L209.8,945.7 M700.2,945.7 L651.1,974.0 M749.2,464.4 L798.3,492.7 M945.4,634.3 L994.4,662.6 M945.4,747.5 L994.4,775.8 M847.3,860.7 L896.3,889.1 M749.2,917.4 L798.3,945.7 M13.7,606.0 L62.7,634.3 M307.9,945.7 L356.9,974.0"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.7" data-role="decor" d="M62.7,577.6 L13.7,606.0 M651.1,407.8 L602.1,436.1 M62.7,804.1 L13.7,832.4 M847.3,464.4 L798.3,492.7 M896.3,492.7 L847.3,521.0 M307.9,945.7 L258.9,974.0 M455.0,974.0 L406.0,1002.3 M553.1,974.0 L504.0,1002.3 M356.9,407.8 L406.0,436.1 M160.8,464.4 L209.8,492.7 M111.8,492.7 L160.8,521.0 M62.7,521.0 L111.8,549.3 M700.2,945.7 L749.2,974.0 M553.1,974.0 L602.1,1002.3 M111.8,889.1 L160.8,917.4"/>










<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.9" data-role="decor" d="M406.0,436.1 L356.9,464.4 M602.1,436.1 L553.1,464.4 M749.2,464.4 L700.2,492.7 M504.0,945.7 L455.0,974.0 M602.1,945.7 L553.1,974.0 M896.3,832.4 L847.3,860.7 M896.3,606.0 L945.4,634.3 M896.3,775.8 L945.4,804.1 M258.9,464.4 L307.9,492.7 M504.0,945.7 L553.1,974.0 M406.0,945.7 L455.0,974.0 M258.9,917.4 L307.9,945.7"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.9" data-role="decor" d="M356.9,464.4 L307.9,492.7 M111.8,662.6 L62.7,690.9 M111.8,719.2 L62.7,747.5 M160.8,804.1 L111.8,832.4 M945.4,690.9 L896.3,719.2 M651.1,917.4 L602.1,945.7 M847.3,577.6 L896.3,606.0 M896.3,662.6 L945.4,690.9 M847.3,804.1 L896.3,832.4 M62.7,634.3 L111.8,662.6"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M307.9,492.7 L258.9,521.0 M209.8,549.3 L160.8,577.6 M455.0,464.4 L406.0,492.7 M209.8,832.4 L160.8,860.7 M258.9,860.7 L209.8,889.1 M896.3,606.0 L847.3,634.3 M455.0,917.4 L406.0,945.7 M553.1,917.4 L504.0,945.7 M896.3,775.8 L847.3,804.1 M749.2,521.0 L798.3,549.3 M798.3,549.3 L847.3,577.6 M553.1,464.4 L602.1,492.7 M553.1,917.4 L602.1,945.7 M455.0,917.4 L504.0,945.7"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M258.9,521.0 L209.8,549.3 M553.1,464.4 L504.0,492.7 M700.2,889.1 L651.1,917.4 M455.0,464.4 L504.0,492.7 M847.3,747.5 L896.3,775.8 M111.8,606.0 L160.8,634.3 M111.8,775.8 L160.8,804.1 M307.9,889.1 L356.9,917.4"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.9" data-role="decor" d="M160.8,577.6 L111.8,606.0 M651.1,464.4 L602.1,492.7 M307.9,889.1 L258.9,917.4 M700.2,492.7 L749.2,521.0 M356.9,464.4 L406.0,492.7 M798.3,832.4 L847.3,860.7 M749.2,860.7 L798.3,889.1 M700.2,889.1 L749.2,917.4 M62.7,690.9 L111.8,719.2 M356.9,917.4 L406.0,945.7"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.9" data-role="decor" d="M111.8,606.0 L62.7,634.3 M504.0,436.1 L455.0,464.4 M111.8,775.8 L62.7,804.1 M798.3,492.7 L749.2,521.0 M847.3,521.0 L798.3,549.3 M896.3,549.3 L847.3,577.6 M847.3,860.7 L798.3,889.1 M798.3,889.1 L749.2,917.4 M504.0,436.1 L553.1,464.4 M406.0,436.1 L455.0,464.4 M111.8,549.3 L160.8,577.6 M111.8,832.4 L160.8,860.7 M209.8,889.1 L258.9,917.4"/>











<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M406.0,492.7 L356.9,521.0 M160.8,690.9 L111.8,719.2 M602.1,889.1 L553.1,917.4 M602.1,492.7 L651.1,521.0 M798.3,775.8 L847.3,804.1 M258.9,521.0 L307.9,549.3 M209.8,549.3 L258.9,577.6 M209.8,832.4 L258.9,860.7"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M356.9,521.0 L307.9,549.3 M258.9,577.6 L209.8,606.0 M258.9,804.1 L209.8,832.4 M307.9,832.4 L258.9,860.7 M700.2,549.3 L749.2,577.6 M749.2,577.6 L798.3,606.0 M798.3,719.2 L847.3,747.5 M700.2,832.4 L749.2,860.7 M160.8,634.3 L209.8,662.6 M160.8,747.5 L209.8,775.8"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M307.9,549.3 L258.9,577.6 M209.8,662.6 L160.8,690.9 M209.8,719.2 L160.8,747.5 M847.3,690.9 L798.3,719.2 M651.1,860.7 L602.1,889.1 M798.3,662.6 L847.3,690.9 M356.9,860.7 L406.0,889.1"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M209.8,606.0 L160.8,634.3 M602.1,492.7 L553.1,521.0 M209.8,775.8 L160.8,804.1 M504.0,889.1 L455.0,917.4 M798.3,606.0 L847.3,634.3 M406.0,492.7 L455.0,521.0 M651.1,860.7 L700.2,889.1 M504.0,889.1 L553.1,917.4 M406.0,889.1 L455.0,917.4"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M160.8,634.3 L111.8,662.6 M160.8,747.5 L111.8,775.8 M700.2,492.7 L651.1,521.0 M847.3,577.6 L798.3,606.0 M896.3,662.6 L847.3,690.9 M896.3,719.2 L847.3,747.5 M847.3,804.1 L798.3,832.4 M847.3,634.3 L896.3,662.6 M307.9,492.7 L356.9,521.0"/>










<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M504.0,492.7 L455.0,521.0 M356.9,860.7 L307.9,889.1 M847.3,634.3 L798.3,662.6 M847.3,747.5 L798.3,775.8 M651.1,521.0 L700.2,549.3 M504.0,492.7 L553.1,521.0 M749.2,804.1 L798.3,832.4"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M455.0,521.0 L406.0,549.3 M700.2,549.3 L651.1,577.6 M455.0,860.7 L406.0,889.1 M553.1,860.7 L504.0,889.1 M749.2,804.1 L700.2,832.4 M700.2,832.4 L651.1,860.7 M553.1,521.0 L602.1,549.3 M209.8,606.0 L258.9,634.3 M455.0,860.7 L504.0,889.1 M209.8,775.8 L258.9,804.1 M307.9,832.4 L356.9,860.7"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M406.0,549.3 L356.9,577.6 M258.9,690.9 L209.8,719.2 M307.9,775.8 L258.9,804.1 M356.9,804.1 L307.9,832.4 M602.1,832.4 L553.1,860.7 M700.2,606.0 L749.2,634.3 M651.1,804.1 L700.2,832.4 M209.8,662.6 L258.9,690.9"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M356.9,577.6 L307.9,606.0 M307.9,606.0 L258.9,634.3 M602.1,549.3 L553.1,577.6 M651.1,577.6 L700.2,606.0 M406.0,832.4 L455.0,860.7"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M258.9,634.3 L209.8,662.6 M258.9,747.5 L209.8,775.8 M602.1,832.4 L651.1,860.7"/>











<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M553.1,521.0 L504.0,549.3 M749.2,577.6 L700.2,606.0 M749.2,634.3 L798.3,662.6 M455.0,521.0 L504.0,549.3 M749.2,747.5 L798.3,775.8 M307.9,549.3 L356.9,577.6 M258.9,577.6 L307.9,606.0 M258.9,804.1 L307.9,832.4"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M504.0,549.3 L455.0,577.6 M651.1,804.1 L602.1,832.4 M258.9,634.3 L307.9,662.6 M258.9,747.5 L307.9,775.8"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M455.0,577.6 L406.0,606.0 M553.1,804.1 L504.0,832.4 M651.1,634.3 L700.2,662.6 M651.1,747.5 L700.2,775.8 M602.1,775.8 L651.1,804.1 M455.0,804.1 L504.0,832.4"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M406.0,606.0 L356.9,634.3 M700.2,662.6 L651.1,690.9 M700.2,719.2 L651.1,747.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M356.9,634.3 L307.9,662.6 M553.1,577.6 L504.0,606.0 M356.9,747.5 L307.9,775.8 M406.0,775.8 L356.9,804.1 M602.1,606.0 L651.1,634.3 M455.0,577.6 L504.0,606.0"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M307.9,662.6 L258.9,690.9 M307.9,719.2 L258.9,747.5 M307.9,606.0 L356.9,634.3 M553.1,804.1 L602.1,832.4 M258.9,690.9 L307.9,719.2"/>










<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M651.1,521.0 L602.1,549.3 M798.3,606.0 L749.2,634.3 M798.3,775.8 L749.2,804.1 M356.9,521.0 L406.0,549.3 M553.1,860.7 L602.1,889.1 M160.8,690.9 L209.8,719.2"/>


<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M504.0,606.0 L455.0,634.3 M504.0,606.0 L553.1,634.3 M356.9,634.3 L406.0,662.6"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M455.0,634.3 L406.0,662.6 M455.0,747.5 L406.0,775.8 M553.1,634.3 L602.1,662.6 M356.9,690.9 L406.0,719.2"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M406.0,662.6 L356.9,690.9 M406.0,719.2 L356.9,747.5 M651.1,690.9 L602.1,719.2 M553.1,747.5 L602.1,775.8"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M356.9,690.9 L307.9,719.2 M602.1,606.0 L553.1,634.3 M651.1,747.5 L602.1,775.8 M406.0,775.8 L455.0,804.1"/>









<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M749.2,521.0 L700.2,549.3 M798.3,549.3 L749.2,577.6 M406.0,889.1 L356.9,917.4 M798.3,832.4 L749.2,860.7 M749.2,860.7 L700.2,889.1 M847.3,690.9 L896.3,719.2 M160.8,577.6 L209.8,606.0 M602.1,889.1 L651.1,917.4 M111.8,662.6 L160.8,690.9 M111.8,719.2 L160.8,747.5 M160.8,804.1 L209.8,832.4 M258.9,860.7 L307.9,889.1"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M651.1,577.6 L602.1,606.0 M700.2,606.0 L651.1,634.3 M749.2,690.9 L700.2,719.2 M700.2,775.8 L651.1,804.1 M700.2,662.6 L749.2,690.9 M700.2,719.2 L749.2,747.5 M356.9,577.6 L406.0,606.0 M307.9,775.8 L356.9,804.1 M356.9,804.1 L406.0,832.4"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M553.1,634.3 L504.0,662.6 M602.1,719.2 L553.1,747.5 M455.0,634.3 L504.0,662.6"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M504.0,662.6 L455.0,690.9 M504.0,662.6 L553.1,690.9"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M455.0,690.9 L406.0,719.2"/>













<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M651.1,634.3 L602.1,662.6 M504.0,775.8 L455.0,804.1 M406.0,606.0 L455.0,634.3 M504.0,775.8 L553.1,804.1 M356.9,747.5 L406.0,775.8"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M602.1,662.6 L553.1,690.9 M406.0,662.6 L455.0,690.9 M406.0,719.2 L455.0,747.5"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M553.1,690.9 L504.0,719.2"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M504.0,719.2 L455.0,747.5 M504.0,719.2 L553.1,747.5"/>












<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M749.2,634.3 L700.2,662.6 M504.0,832.4 L455.0,860.7 M749.2,747.5 L700.2,775.8 M504.0,549.3 L553.1,577.6 M406.0,549.3 L455.0,577.6 M504.0,832.4 L553.1,860.7"/>



<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M553.1,747.5 L504.0,775.8 M455.0,747.5 L504.0,775.8"/>

<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M455.0,804.1 L406.0,832.4 M553.1,577.6 L602.1,606.0"/>
<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M406.0,832.4 L356.9,860.7 M798.3,662.6 L749.2,690.9 M798.3,719.2 L749.2,747.5 M602.1,549.3 L651.1,577.6 M749.2,690.9 L798.3,719.2 M700.2,775.8 L749.2,804.1 M209.8,719.2 L258.9,747.5"/>













<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M602.1,775.8 L553.1,804.1 M651.1,690.9 L700.2,719.2 M307.9,662.6 L356.9,690.9 M307.9,719.2 L356.9,747.5"/>




<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.9" data-role="decor" d="M356.9,917.4 L307.9,945.7 M945.4,634.3 L896.3,662.6 M945.4,747.5 L896.3,775.8 M651.1,464.4 L700.2,492.7 M896.3,719.2 L945.4,747.5 M209.8,492.7 L258.9,521.0 M160.8,521.0 L209.8,549.3 M651.1,917.4 L700.2,945.7 M62.7,747.5 L111.8,775.8 M160.8,860.7 L209.8,889.1"/>

















<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.7" data-role="decor" d="M356.9,974.0 L307.9,1002.3 M1043.4,690.9 L994.4,719.2 M798.3,945.7 L749.2,974.0 M651.1,407.8 L700.2,436.1 M994.4,662.6 L1043.4,690.9 M994.4,719.2 L1043.4,747.5 M13.7,549.3 L62.7,577.6 M651.1,974.0 L700.2,1002.3 M-35.3,634.3 L13.7,662.6 M-35.3,747.5 L13.7,775.8 M13.7,832.4 L62.7,860.7 M209.8,945.7 L258.9,974.0"/>






















































































































































































































































<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M602.1,662.6 L651.1,690.9 M602.1,719.2 L651.1,747.5"/>


















<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M553.1,690.9 L602.1,719.2"/>

















<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="1.0" data-role="decor" d="M455.0,690.9 L504.0,719.2"/>














































































































































<path class="s-grid" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2.5 3" opacity="0.1" data-role="decor" d="M-378.5,662.6 L-329.5,690.9"/>


















<path class="f-surface-2 s-surface-2" d="M585.8,846.6 L573.8,851.9 L573.8,875.5 L585.8,870.2 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M573.8,851.9 L559.9,855.2 L559.9,878.8 L573.8,875.5 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M559.9,855.2 L544.9,856.4 L544.9,880.0 L559.9,878.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M544.9,856.4 L529.9,855.2 L529.9,878.8 L544.9,880.0 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M529.9,855.2 L516.0,851.9 L516.0,875.5 L529.9,878.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M516.0,851.9 L504.0,846.6 L504.0,870.2 L516.0,875.5 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M504.0,846.6 L209.8,676.7 L209.8,700.3 L504.0,870.2 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M209.8,676.7 L200.6,669.8 L200.6,693.4 L209.8,700.3 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M200.6,669.8 L194.9,661.8 L194.9,685.4 L200.6,693.4 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M194.9,661.8 L192.9,653.1 L192.9,676.7 L194.9,685.4 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M807.0,705.0 L805.0,713.7 L805.0,737.3 L807.0,728.6 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M805.0,713.7 L799.3,721.7 L799.3,745.3 L805.0,737.3 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M799.3,721.7 L790.1,728.6 L790.1,752.2 L799.3,745.3 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M790.1,728.6 L585.8,846.6 L585.8,870.2 L790.1,752.2 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M585.8,870.2 L573.8,875.5" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M573.8,875.5 L559.9,878.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M559.9,878.8 L544.9,880.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M544.9,880.0 L529.9,878.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M529.9,878.8 L516.0,875.5" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M516.0,875.5 L504.0,870.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M504.0,870.2 L209.8,700.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M209.8,700.3 L200.6,693.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M200.6,693.4 L194.9,685.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M194.9,685.4 L192.9,676.7" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M807.0,728.6 L805.0,737.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M805.0,737.3 L799.3,745.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M799.3,745.3 L790.1,752.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M790.1,752.2 L585.8,870.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M192.9,676.7 L192.9,653.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M807.0,728.6 L807.0,705.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M585.8,846.6 L573.8,851.9 L559.9,855.2 L544.9,856.4 L529.9,855.2 L516.0,851.9 L504.0,846.6 L209.8,676.7 L200.6,669.8 L194.9,661.8 L192.9,653.1 L194.9,644.5 L200.6,636.5 L209.8,629.5 L414.1,511.6 L426.1,506.3 L440.0,502.9 L455.0,501.8 L470.0,502.9 L483.9,506.3 L495.9,511.6 L790.1,681.4 L799.3,688.4 L805.0,696.4 L807.0,705.0 L805.0,713.7 L799.3,721.7 L790.1,728.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M692.0,247.4 L553.1,327.6 L553.1,733.3 L692.0,653.1 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M553.1,327.6 L365.1,219.0 L365.1,624.8 L553.1,733.3 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M692.0,653.1 L553.1,733.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M553.1,733.3 L365.1,624.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M692.0,653.1 L692.0,247.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M553.1,733.3 L553.1,327.6" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M365.1,624.8 L365.1,219.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M504.0,138.8 L692.0,247.4 L553.1,327.6 L365.1,219.0 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-accent-tint s-ink" d="M479.5,636.6 L479.2,635.3 L478.5,634.0 L477.5,633.1 L440.7,611.8 L439.7,611.6 L438.9,612.0 L438.7,613.0 L438.7,664.9 L438.9,666.3 L439.7,667.6 L440.7,668.5 L477.5,689.7 L478.5,690.0 L479.2,689.5 L479.5,688.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M474.6,643.2 L474.3,641.9 L473.6,640.6 L472.6,639.7 L445.6,624.1 L444.6,623.8 L443.8,624.3 L443.6,625.3 L443.6,653.6 L443.8,654.9 L444.6,656.2 L445.6,657.1 L472.6,672.7 L473.6,673.0 L474.3,672.6 L474.6,671.5 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-accent" d="M474.6,662.6 L473.9,660.2 L472.2,658.3 L470.4,658.2 L469.7,659.7 L470.4,662.2 L472.2,664.0 L473.9,664.2 Z" stroke="none" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M422.3,608.3 L422.0,607.0 L421.3,605.7 L420.3,604.8 L383.5,583.5 L382.5,583.3 L381.7,583.7 L381.5,584.7 L381.5,617.7 L381.7,619.1 L382.5,620.4 L383.5,621.3 L420.3,642.5 L421.3,642.8 L422.0,642.4 L422.3,641.3 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M418.6,610.4 L418.4,609.1 L417.6,607.8 L416.6,606.9 L387.2,589.9 L386.2,589.6 L385.4,590.1 L385.1,591.1 L385.1,615.6 L385.4,617.0 L386.2,618.3 L387.2,619.2 L416.6,636.1 L417.6,636.4 L418.4,636.0 L418.6,635.0 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M418.6,610.4 L418.4,609.1 L417.6,607.8 L416.6,606.9 L387.2,589.9 L386.2,589.6 L385.4,590.1 L385.1,591.1 L385.1,615.6 L385.4,617.0 L386.2,618.3 L387.2,619.2 L416.6,636.1 L417.6,636.4 L418.4,636.0 L418.6,635.0 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M536.7,674.4 L536.5,673.0 L535.7,671.7 L534.7,670.8 L497.9,649.6 L496.9,649.3 L496.1,649.8 L495.9,650.8 L495.9,683.8 L496.1,685.1 L496.9,686.4 L497.9,687.3 L534.7,708.6 L535.7,708.9 L536.5,708.4 L536.7,707.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M533.1,676.5 L532.8,675.2 L532.0,673.9 L531.0,673.0 L501.6,656.0 L500.6,655.7 L499.8,656.1 L499.5,657.1 L499.5,681.7 L499.8,683.0 L500.6,684.3 L501.6,685.2 L531.0,702.2 L532.0,702.5 L532.8,702.0 L533.1,701.0 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M533.1,676.5 L532.8,675.2 L532.0,673.9 L531.0,673.0 L501.6,656.0 L500.6,655.7 L499.8,656.1 L499.5,657.1 L499.5,681.7 L499.8,683.0 L500.6,684.3 L501.6,685.2 L531.0,702.2 L532.0,702.5 L532.8,702.0 L533.1,701.0 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-mute" d="M365.1,558.8 L553.1,667.3" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M438.7,551.7 L438.4,550.4 L437.6,549.1 L436.6,548.2 L391.7,522.2 L390.6,521.9 L389.9,522.4 L389.6,523.4 L389.6,556.4 L389.9,557.7 L390.6,559.0 L391.7,559.9 L436.6,585.9 L437.6,586.2 L438.4,585.7 L438.7,584.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M438.7,551.7 L438.4,550.4 L437.6,549.1 L436.6,548.2 L391.7,522.2 L390.6,521.9 L389.9,522.4 L389.6,523.4 L389.6,556.4 L389.9,557.7 L390.6,559.0 L391.7,559.9 L436.6,585.9 L437.6,586.2 L438.4,585.7 L438.7,584.7 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M528.6,603.6 L528.3,602.3 L527.5,601.0 L526.5,600.1 L481.6,574.1 L480.5,573.8 L479.8,574.3 L479.5,575.3 L479.5,608.3 L479.8,609.6 L480.5,610.9 L481.6,611.8 L526.5,637.8 L527.5,638.1 L528.3,637.6 L528.6,636.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M528.6,603.6 L528.3,602.3 L527.5,601.0 L526.5,600.1 L481.6,574.1 L480.5,573.8 L479.8,574.3 L479.5,575.3 L479.5,608.3 L479.8,609.6 L480.5,610.9 L481.6,611.8 L526.5,637.8 L527.5,638.1 L528.3,637.6 L528.6,636.6 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-mute" d="M365.1,492.7 L553.1,601.2" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M438.7,485.6 L438.4,484.3 L437.6,483.0 L436.6,482.1 L391.7,456.1 L390.6,455.9 L389.9,456.3 L389.6,457.3 L389.6,490.4 L389.9,491.7 L390.6,493.0 L391.7,493.9 L436.6,519.8 L437.6,520.1 L438.4,519.7 L438.7,518.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M438.7,485.6 L438.4,484.3 L437.6,483.0 L436.6,482.1 L391.7,456.1 L390.6,455.9 L389.9,456.3 L389.6,457.3 L389.6,490.4 L389.9,491.7 L390.6,493.0 L391.7,493.9 L436.6,519.8 L437.6,520.1 L438.4,519.7 L438.7,518.7 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M528.6,537.5 L528.3,536.2 L527.5,534.9 L526.5,534.0 L481.6,508.0 L480.5,507.8 L479.8,508.2 L479.5,509.2 L479.5,542.3 L479.8,543.6 L480.5,544.9 L481.6,545.8 L526.5,571.7 L527.5,572.0 L528.3,571.6 L528.6,570.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M528.6,537.5 L528.3,536.2 L527.5,534.9 L526.5,534.0 L481.6,508.0 L480.5,507.8 L479.8,508.2 L479.5,509.2 L479.5,542.3 L479.8,543.6 L480.5,544.9 L481.6,545.8 L526.5,571.7 L527.5,572.0 L528.3,571.6 L528.6,570.6 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-mute" d="M365.1,426.7 L553.1,535.2" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M438.7,419.6 L438.4,418.2 L437.6,416.9 L436.6,416.0 L391.7,390.1 L390.6,389.8 L389.9,390.2 L389.6,391.3 L389.6,424.3 L389.9,425.6 L390.6,426.9 L391.7,427.8 L436.6,453.8 L437.6,454.1 L438.4,453.6 L438.7,452.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M438.7,419.6 L438.4,418.2 L437.6,416.9 L436.6,416.0 L391.7,390.1 L390.6,389.8 L389.9,390.2 L389.6,391.3 L389.6,424.3 L389.9,425.6 L390.6,426.9 L391.7,427.8 L436.6,453.8 L437.6,454.1 L438.4,453.6 L438.7,452.6 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M528.6,471.5 L528.3,470.1 L527.5,468.8 L526.5,467.9 L481.6,442.0 L480.5,441.7 L479.8,442.1 L479.5,443.2 L479.5,476.2 L479.8,477.5 L480.5,478.8 L481.6,479.7 L526.5,505.7 L527.5,506.0 L528.3,505.5 L528.6,504.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M528.6,471.5 L528.3,470.1 L527.5,468.8 L526.5,467.9 L481.6,442.0 L480.5,441.7 L479.8,442.1 L479.5,443.2 L479.5,476.2 L479.8,477.5 L480.5,478.8 L481.6,479.7 L526.5,505.7 L527.5,506.0 L528.3,505.5 L528.6,504.5 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-mute" d="M365.1,360.6 L553.1,469.1" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M438.7,353.5 L438.4,352.2 L437.6,350.9 L436.6,350.0 L391.7,324.0 L390.6,323.8 L389.9,324.2 L389.6,325.2 L389.6,358.2 L389.9,359.6 L390.6,360.9 L391.7,361.8 L436.6,387.7 L437.6,388.0 L438.4,387.6 L438.7,386.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M438.7,353.5 L438.4,352.2 L437.6,350.9 L436.6,350.0 L391.7,324.0 L390.6,323.8 L389.9,324.2 L389.6,325.2 L389.6,358.2 L389.9,359.6 L390.6,360.9 L391.7,361.8 L436.6,387.7 L437.6,388.0 L438.4,387.6 L438.7,386.5 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M528.6,405.4 L528.3,404.1 L527.5,402.8 L526.5,401.9 L481.6,375.9 L480.5,375.7 L479.8,376.1 L479.5,377.1 L479.5,410.1 L479.8,411.5 L480.5,412.8 L481.6,413.7 L526.5,439.6 L527.5,439.9 L528.3,439.5 L528.6,438.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M528.6,405.4 L528.3,404.1 L527.5,402.8 L526.5,401.9 L481.6,375.9 L480.5,375.7 L479.8,376.1 L479.5,377.1 L479.5,410.1 L479.8,411.5 L480.5,412.8 L481.6,413.7 L526.5,439.6 L527.5,439.9 L528.3,439.5 L528.6,438.4 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-mute" d="M365.1,294.5 L553.1,403.1" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M438.7,287.5 L438.4,286.1 L437.6,284.8 L436.6,283.9 L391.7,258.0 L390.6,257.7 L389.9,258.1 L389.6,259.1 L389.6,292.2 L389.9,293.5 L390.6,294.8 L391.7,295.7 L436.6,321.7 L437.6,321.9 L438.4,321.5 L438.7,320.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M438.7,287.5 L438.4,286.1 L437.6,284.8 L436.6,283.9 L391.7,258.0 L390.6,257.7 L389.9,258.1 L389.6,259.1 L389.6,292.2 L389.9,293.5 L390.6,294.8 L391.7,295.7 L436.6,321.7 L437.6,321.9 L438.4,321.5 L438.7,320.5 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M528.6,339.4 L528.3,338.0 L527.5,336.7 L526.5,335.8 L481.6,309.9 L480.5,309.6 L479.8,310.0 L479.5,311.1 L479.5,344.1 L479.8,345.4 L480.5,346.7 L481.6,347.6 L526.5,373.6 L527.5,373.8 L528.3,373.4 L528.6,372.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M528.6,339.4 L528.3,338.0 L527.5,336.7 L526.5,335.8 L481.6,309.9 L480.5,309.6 L479.8,310.0 L479.5,311.1 L479.5,344.1 L479.8,345.4 L480.5,346.7 L481.6,347.6 L526.5,373.6 L527.5,373.8 L528.3,373.4 L528.6,372.4 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M661.4,616.6 L661.6,615.2 L662.4,613.9 L663.4,613.0 L683.8,601.2 L684.9,601.0 L685.6,601.4 L685.9,602.4 L685.9,635.4 L685.6,636.8 L684.9,638.1 L683.8,639.0 L663.4,650.8 L662.4,651.1 L661.6,650.6 L661.4,649.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M665.0,618.7 L665.3,617.4 L666.1,616.1 L667.1,615.2 L680.2,607.6 L681.2,607.3 L681.9,607.8 L682.2,608.8 L682.2,633.3 L681.9,634.7 L681.2,636.0 L680.2,636.9 L667.1,644.4 L666.1,644.7 L665.3,644.2 L665.0,643.2 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M665.0,618.7 L665.3,617.4 L666.1,616.1 L667.1,615.2 L680.2,607.6 L681.2,607.3 L681.9,607.8 L682.2,608.8 L682.2,633.3 L681.9,634.7 L681.2,636.0 L680.2,636.9 L667.1,644.4 L666.1,644.7 L665.3,644.2 L665.0,643.2 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M567.4,670.8 L567.7,669.5 L568.4,668.2 L569.4,667.3 L589.9,655.5 L590.9,655.2 L591.6,655.7 L591.9,656.7 L591.9,689.7 L591.6,691.0 L590.9,692.3 L589.9,693.2 L569.4,705.0 L568.4,705.3 L567.7,704.9 L567.4,703.9 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M571.1,673.0 L571.3,671.6 L572.1,670.3 L573.1,669.4 L586.2,661.9 L587.2,661.6 L587.9,662.0 L588.2,663.0 L588.2,687.6 L587.9,688.9 L587.2,690.2 L586.2,691.1 L573.1,698.7 L572.1,698.9 L571.3,698.5 L571.1,697.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M571.1,673.0 L571.3,671.6 L572.1,670.3 L573.1,669.4 L586.2,661.9 L587.2,661.6 L587.9,662.0 L588.2,663.0 L588.2,687.6 L587.9,688.9 L587.2,690.2 L586.2,691.1 L573.1,698.7 L572.1,698.9 L571.3,698.5 L571.1,697.5 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M661.4,550.5 L661.6,549.2 L662.4,547.9 L663.4,547.0 L683.8,535.2 L684.9,534.9 L685.6,535.3 L685.9,536.4 L685.9,569.4 L685.6,570.7 L684.9,572.0 L683.8,572.9 L663.4,584.7 L662.4,585.0 L661.6,584.6 L661.4,583.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M665.0,552.6 L665.3,551.3 L666.1,550.0 L667.1,549.1 L680.2,541.5 L681.2,541.3 L681.9,541.7 L682.2,542.7 L682.2,567.3 L681.9,568.6 L681.2,569.9 L680.2,570.8 L667.1,578.3 L666.1,578.6 L665.3,578.2 L665.0,577.2 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M665.0,552.6 L665.3,551.3 L666.1,550.0 L667.1,549.1 L680.2,541.5 L681.2,541.3 L681.9,541.7 L682.2,542.7 L682.2,567.3 L681.9,568.6 L681.2,569.9 L680.2,570.8 L667.1,578.3 L666.1,578.6 L665.3,578.2 L665.0,577.2 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M567.4,604.8 L567.7,603.4 L568.4,602.1 L569.4,601.2 L589.9,589.4 L590.9,589.2 L591.6,589.6 L591.9,590.6 L591.9,623.6 L591.6,625.0 L590.9,626.3 L589.9,627.2 L569.4,639.0 L568.4,639.3 L567.7,638.8 L567.4,637.8 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M571.1,606.9 L571.3,605.6 L572.1,604.3 L573.1,603.4 L586.2,595.8 L587.2,595.5 L587.9,596.0 L588.2,597.0 L588.2,621.5 L587.9,622.9 L587.2,624.2 L586.2,625.1 L573.1,632.6 L572.1,632.9 L571.3,632.5 L571.1,631.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M571.1,606.9 L571.3,605.6 L572.1,604.3 L573.1,603.4 L586.2,595.8 L587.2,595.5 L587.9,596.0 L588.2,597.0 L588.2,621.5 L587.9,622.9 L587.2,624.2 L586.2,625.1 L573.1,632.6 L572.1,632.9 L571.3,632.5 L571.1,631.4 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M661.4,484.5 L661.6,483.1 L662.4,481.8 L663.4,480.9 L683.8,469.1 L684.9,468.8 L685.6,469.3 L685.9,470.3 L685.9,503.3 L685.6,504.7 L684.9,506.0 L683.8,506.9 L663.4,518.7 L662.4,518.9 L661.6,518.5 L661.4,517.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M665.0,486.6 L665.3,485.2 L666.1,483.9 L667.1,483.0 L680.2,475.5 L681.2,475.2 L681.9,475.6 L682.2,476.7 L682.2,501.2 L681.9,502.5 L681.2,503.8 L680.2,504.7 L667.1,512.3 L666.1,512.6 L665.3,512.1 L665.0,511.1 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M665.0,486.6 L665.3,485.2 L666.1,483.9 L667.1,483.0 L680.2,475.5 L681.2,475.2 L681.9,475.6 L682.2,476.7 L682.2,501.2 L681.9,502.5 L681.2,503.8 L680.2,504.7 L667.1,512.3 L666.1,512.6 L665.3,512.1 L665.0,511.1 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M567.4,538.7 L567.7,537.4 L568.4,536.1 L569.4,535.2 L589.9,523.4 L590.9,523.1 L591.6,523.5 L591.9,524.6 L591.9,557.6 L591.6,558.9 L590.9,560.2 L589.9,561.1 L569.4,572.9 L568.4,573.2 L567.7,572.8 L567.4,571.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M571.1,540.8 L571.3,539.5 L572.1,538.2 L573.1,537.3 L586.2,529.7 L587.2,529.5 L587.9,529.9 L588.2,530.9 L588.2,555.5 L587.9,556.8 L587.2,558.1 L586.2,559.0 L573.1,566.6 L572.1,566.8 L571.3,566.4 L571.1,565.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M571.1,540.8 L571.3,539.5 L572.1,538.2 L573.1,537.3 L586.2,529.7 L587.2,529.5 L587.9,529.9 L588.2,530.9 L588.2,555.5 L587.9,556.8 L587.2,558.1 L586.2,559.0 L573.1,566.6 L572.1,566.8 L571.3,566.4 L571.1,565.4 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M661.4,418.4 L661.6,417.1 L662.4,415.8 L663.4,414.9 L683.8,403.1 L684.9,402.8 L685.6,403.2 L685.9,404.2 L685.9,437.3 L685.6,438.6 L684.9,439.9 L683.8,440.8 L663.4,452.6 L662.4,452.9 L661.6,452.4 L661.4,451.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M665.0,420.5 L665.3,419.2 L666.1,417.9 L667.1,417.0 L680.2,409.4 L681.2,409.2 L681.9,409.6 L682.2,410.6 L682.2,435.1 L681.9,436.5 L681.2,437.8 L680.2,438.7 L667.1,446.2 L666.1,446.5 L665.3,446.1 L665.0,445.1 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M665.0,420.5 L665.3,419.2 L666.1,417.9 L667.1,417.0 L680.2,409.4 L681.2,409.2 L681.9,409.6 L682.2,410.6 L682.2,435.1 L681.9,436.5 L681.2,437.8 L680.2,438.7 L667.1,446.2 L666.1,446.5 L665.3,446.1 L665.0,445.1 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M567.4,472.7 L567.7,471.3 L568.4,470.0 L569.4,469.1 L589.9,457.3 L590.9,457.0 L591.6,457.5 L591.9,458.5 L591.9,491.5 L591.6,492.9 L590.9,494.2 L589.9,495.1 L569.4,506.9 L568.4,507.1 L567.7,506.7 L567.4,505.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M571.1,474.8 L571.3,473.4 L572.1,472.1 L573.1,471.2 L586.2,463.7 L587.2,463.4 L587.9,463.8 L588.2,464.9 L588.2,489.4 L587.9,490.7 L587.2,492.0 L586.2,492.9 L573.1,500.5 L572.1,500.8 L571.3,500.3 L571.1,499.3 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M571.1,474.8 L571.3,473.4 L572.1,472.1 L573.1,471.2 L586.2,463.7 L587.2,463.4 L587.9,463.8 L588.2,464.9 L588.2,489.4 L587.9,490.7 L587.2,492.0 L586.2,492.9 L573.1,500.5 L572.1,500.8 L571.3,500.3 L571.1,499.3 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M661.4,352.3 L661.6,351.0 L662.4,349.7 L663.4,348.8 L683.8,337.0 L684.9,336.7 L685.6,337.2 L685.9,338.2 L685.9,371.2 L685.6,372.5 L684.9,373.8 L683.8,374.7 L663.4,386.5 L662.4,386.8 L661.6,386.4 L661.4,385.4 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M665.0,354.5 L665.3,353.1 L666.1,351.8 L667.1,350.9 L680.2,343.4 L681.2,343.1 L681.9,343.5 L682.2,344.6 L682.2,369.1 L681.9,370.4 L681.2,371.7 L680.2,372.6 L667.1,380.2 L666.1,380.4 L665.3,380.0 L665.0,379.0 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M665.0,354.5 L665.3,353.1 L666.1,351.8 L667.1,350.9 L680.2,343.4 L681.2,343.1 L681.9,343.5 L682.2,344.6 L682.2,369.1 L681.9,370.4 L681.2,371.7 L680.2,372.6 L667.1,380.2 L666.1,380.4 L665.3,380.0 L665.0,379.0 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M567.4,406.6 L567.7,405.3 L568.4,404.0 L569.4,403.1 L589.9,391.3 L590.9,391.0 L591.6,391.4 L591.9,392.4 L591.9,425.5 L591.6,426.8 L590.9,428.1 L589.9,429.0 L569.4,440.8 L568.4,441.1 L567.7,440.6 L567.4,439.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M571.1,408.7 L571.3,407.4 L572.1,406.1 L573.1,405.2 L586.2,397.6 L587.2,397.4 L587.9,397.8 L588.2,398.8 L588.2,423.3 L587.9,424.7 L587.2,426.0 L586.2,426.9 L573.1,434.4 L572.1,434.7 L571.3,434.3 L571.1,433.3 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M571.1,408.7 L571.3,407.4 L572.1,406.1 L573.1,405.2 L586.2,397.6 L587.2,397.4 L587.9,397.8 L588.2,398.8 L588.2,423.3 L587.9,424.7 L587.2,426.0 L586.2,426.9 L573.1,434.4 L572.1,434.7 L571.3,434.3 L571.1,433.3 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M661.4,286.3 L661.6,284.9 L662.4,283.6 L663.4,282.7 L683.8,270.9 L684.9,270.7 L685.6,271.1 L685.9,272.1 L685.9,305.2 L685.6,306.5 L684.9,307.8 L683.8,308.7 L663.4,320.5 L662.4,320.8 L661.6,320.3 L661.4,319.3 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M665.0,288.4 L665.3,287.1 L666.1,285.8 L667.1,284.9 L680.2,277.3 L681.2,277.0 L681.9,277.5 L682.2,278.5 L682.2,303.0 L681.9,304.4 L681.2,305.7 L680.2,306.6 L667.1,314.1 L666.1,314.4 L665.3,314.0 L665.0,312.9 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M665.0,288.4 L665.3,287.1 L666.1,285.8 L667.1,284.9 L680.2,277.3 L681.2,277.0 L681.9,277.5 L682.2,278.5 L682.2,303.0 L681.9,304.4 L681.2,305.7 L680.2,306.6 L667.1,314.1 L666.1,314.4 L665.3,314.0 L665.0,312.9 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M567.4,340.5 L567.7,339.2 L568.4,337.9 L569.4,337.0 L589.9,325.2 L590.9,324.9 L591.6,325.4 L591.9,326.4 L591.9,359.4 L591.6,360.8 L590.9,362.0 L589.9,363.0 L569.4,374.7 L568.4,375.0 L567.7,374.6 L567.4,373.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-ink" d="M571.1,342.7 L571.3,341.3 L572.1,340.0 L573.1,339.1 L586.2,331.6 L587.2,331.3 L587.9,331.7 L588.2,332.8 L588.2,357.3 L587.9,358.6 L587.2,359.9 L586.2,360.8 L573.1,368.4 L572.1,368.7 L571.3,368.2 L571.1,367.2 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M571.1,342.7 L571.3,341.3 L572.1,340.0 L573.1,339.1 L586.2,331.6 L587.2,331.3 L587.9,331.7 L588.2,332.8 L588.2,357.3 L587.9,358.6 L587.2,359.9 L586.2,360.8 L573.1,368.4 L572.1,368.7 L571.3,368.2 L571.1,367.2 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M446.8,598.4 L422.3,612.6 L422.3,620.1 L446.8,606.0 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M422.3,612.6 L356.9,574.8 L356.9,582.4 L422.3,620.1 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,606.0 L422.3,620.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,620.1 L356.9,582.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,606.0 L446.8,598.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,620.1 L422.3,612.6" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M356.9,582.4 L356.9,574.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M381.5,560.7 L446.8,598.4 L422.3,612.6 L356.9,574.8 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,593.7 L421.8,592.1 L420.7,590.9 L358.6,555.0 L357.4,554.9 L356.9,555.9 L356.9,572.9 L357.4,574.5 L358.6,575.8 L420.7,611.6 L421.8,611.7 L422.3,610.7 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M536.7,650.3 L512.2,664.5 L512.2,672.0 L536.7,657.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M512.2,664.5 L446.8,626.7 L446.8,634.3 L512.2,672.0 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,657.9 L512.2,672.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,672.0 L446.8,634.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,657.9 L536.7,650.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,672.0 L512.2,664.5" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,634.3 L446.8,626.7" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M471.4,612.6 L536.7,650.3 L512.2,664.5 L446.8,626.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,645.6 L511.7,644.0 L510.6,642.8 L448.5,606.9 L447.3,606.8 L446.8,607.8 L446.8,624.8 L447.3,626.4 L448.5,627.7 L510.6,663.5 L511.7,663.6 L512.2,662.6 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M446.8,532.3 L422.3,546.5 L422.3,554.0 L446.8,539.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M422.3,546.5 L356.9,508.8 L356.9,516.3 L422.3,554.0 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,539.9 L422.3,554.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,554.0 L356.9,516.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,539.9 L446.8,532.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,554.0 L422.3,546.5" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M356.9,516.3 L356.9,508.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M381.5,494.6 L446.8,532.3 L422.3,546.5 L356.9,508.8 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,527.6 L421.8,526.0 L420.7,524.8 L358.6,488.9 L357.4,488.8 L356.9,489.9 L356.9,506.9 L357.4,508.5 L358.6,509.7 L420.7,545.6 L421.8,545.7 L422.3,544.6 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M536.7,584.2 L512.2,598.4 L512.2,606.0 L536.7,591.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M512.2,598.4 L446.8,560.7 L446.8,568.2 L512.2,606.0 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,591.8 L512.2,606.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,606.0 L446.8,568.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,591.8 L536.7,584.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,606.0 L512.2,598.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,568.2 L446.8,560.7" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M471.4,546.5 L536.7,584.2 L512.2,598.4 L446.8,560.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,579.5 L511.7,577.9 L510.6,576.7 L448.5,540.8 L447.3,540.7 L446.8,541.8 L446.8,558.8 L447.3,560.4 L448.5,561.6 L510.6,597.5 L511.7,597.6 L512.2,596.5 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M446.8,466.3 L422.3,480.4 L422.3,488.0 L446.8,473.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M422.3,480.4 L356.9,442.7 L356.9,450.2 L422.3,488.0 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,473.8 L422.3,488.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,488.0 L356.9,450.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,473.8 L446.8,466.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,488.0 L422.3,480.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M356.9,450.2 L356.9,442.7" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M381.5,428.5 L446.8,466.3 L422.3,480.4 L356.9,442.7 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,461.6 L421.8,460.0 L420.7,458.7 L358.6,422.9 L357.4,422.8 L356.9,423.8 L356.9,440.8 L357.4,442.4 L358.6,443.6 L420.7,479.5 L421.8,479.6 L422.3,478.6 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M536.7,518.2 L512.2,532.3 L512.2,539.9 L536.7,525.7 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M512.2,532.3 L446.8,494.6 L446.8,502.1 L512.2,539.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,525.7 L512.2,539.9" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,539.9 L446.8,502.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,525.7 L536.7,518.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,539.9 L512.2,532.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,502.1 L446.8,494.6" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M471.4,480.4 L536.7,518.2 L512.2,532.3 L446.8,494.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,513.5 L511.7,511.9 L510.6,510.6 L448.5,474.8 L447.3,474.7 L446.8,475.7 L446.8,492.7 L447.3,494.3 L448.5,495.5 L510.6,531.4 L511.7,531.5 L512.2,530.5 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M446.8,400.2 L422.3,414.4 L422.3,421.9 L446.8,407.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M422.3,414.4 L356.9,376.6 L356.9,384.2 L422.3,421.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,407.8 L422.3,421.9" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,421.9 L356.9,384.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,407.8 L446.8,400.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,421.9 L422.3,414.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M356.9,384.2 L356.9,376.6" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M381.5,362.5 L446.8,400.2 L422.3,414.4 L356.9,376.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,395.5 L421.8,393.9 L420.7,392.7 L358.6,356.8 L357.4,356.7 L356.9,357.8 L356.9,374.7 L357.4,376.4 L358.6,377.6 L420.7,413.4 L421.8,413.6 L422.3,412.5 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M536.7,452.1 L512.2,466.3 L512.2,473.8 L536.7,459.7 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M512.2,466.3 L446.8,428.5 L446.8,436.1 L512.2,473.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,459.7 L512.2,473.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,473.8 L446.8,436.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,459.7 L536.7,452.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,473.8 L512.2,466.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,436.1 L446.8,428.5" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M471.4,414.4 L536.7,452.1 L512.2,466.3 L446.8,428.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,447.4 L511.7,445.8 L510.6,444.6 L448.5,408.7 L447.3,408.6 L446.8,409.7 L446.8,426.7 L447.3,428.3 L448.5,429.5 L510.6,465.3 L511.7,465.5 L512.2,464.4 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M446.8,334.2 L422.3,348.3 L422.3,355.9 L446.8,341.7 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M422.3,348.3 L356.9,310.6 L356.9,318.1 L422.3,355.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,341.7 L422.3,355.9" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,355.9 L356.9,318.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,341.7 L446.8,334.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,355.9 L422.3,348.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M356.9,318.1 L356.9,310.6" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M381.5,296.4 L446.8,334.2 L422.3,348.3 L356.9,310.6 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M422.3,329.5 L421.8,327.8 L420.7,326.6 L358.6,290.8 L357.4,290.6 L356.9,291.7 L356.9,308.7 L357.4,310.3 L358.6,311.5 L420.7,347.4 L421.8,347.5 L422.3,346.4 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M536.7,386.1 L512.2,400.2 L512.2,407.8 L536.7,393.6 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M512.2,400.2 L446.8,362.5 L446.8,370.0 L512.2,407.8 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,393.6 L512.2,407.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,407.8 L446.8,370.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M536.7,393.6 L536.7,386.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,407.8 L512.2,400.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M446.8,370.0 L446.8,362.5" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M471.4,348.3 L536.7,386.1 L512.2,400.2 L446.8,362.5 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M512.2,381.4 L511.7,379.7 L510.6,378.5 L448.5,342.7 L447.3,342.5 L446.8,343.6 L446.8,360.6 L447.3,362.2 L448.5,363.4 L510.6,399.3 L511.7,399.4 L512.2,398.3 Z" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M692.0,256.8 L643.0,285.1 L643.0,719.2 L692.0,690.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M643.0,285.1 L610.3,266.2 L610.3,700.3 L643.0,719.2 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M692.0,690.9 L643.0,719.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M643.0,719.2 L610.3,700.3" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M692.0,690.9 L692.0,256.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M643.0,719.2 L643.0,285.1" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M610.3,700.3 L610.3,266.2" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M659.3,237.9 L692.0,256.8 L643.0,285.1 L610.3,266.2 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M635.6,310.1 L635.5,309.6 L635.2,309.1 L634.8,308.7 L618.5,299.3 L618.0,299.1 L617.7,299.3 L617.6,299.7 L617.6,675.3 L617.7,675.8 L618.0,676.4 L618.5,676.7 L634.8,686.2 L635.2,686.3 L635.5,686.1 L635.6,685.7 Z" fill="url(#hatch)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-accent s-accent" d="M635.6,489.4 L635.5,488.9 L635.2,488.4 L634.8,488.0 L618.5,478.6 L618.0,478.4 L617.7,478.6 L617.6,479.0 L617.6,514.9 L617.7,515.4 L618.0,515.9 L618.5,516.3 L634.8,525.7 L635.2,525.8 L635.5,525.7 L635.6,525.3 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-2 s-surface-2" d="M643.0,223.8 L602.1,247.4 L602.1,270.9 L643.0,247.4 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-1 s-surface-1" d="M602.1,247.4 L553.1,219.0 L553.1,242.6 L602.1,270.9 Z" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M643.0,247.4 L602.1,270.9" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M602.1,270.9 L553.1,242.6" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M643.0,247.4 L643.0,223.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M602.1,270.9 L602.1,247.4" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M553.1,242.6 L553.1,219.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="f-surface-0 s-ink" d="M593.9,195.4 L643.0,223.8 L602.1,247.4 L553.1,219.0 Z" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<path class="s-ink" d="M504.0,167.1 L504.0,120.0" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<circle class="f-surface-0 s-ink" cx="291.6" cy="628.8" r="16.9" stroke-width="1.7"/>
<circle class="f-surface-0 s-ink" cx="316.1" cy="661.8" r="16.9" stroke-width="1.7"/>
<path class="s-ink" d="M602.1,780.5 L602.1,742.8" fill="none" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
<circle class="f-surface-1 s-ink" cx="602.1" cy="727.2" r="28.3" stroke-width="1.7"/>
<path class="s-mute" d="M589.4,730.0 L599.3,723.0 L612.0,725.8" fill="none" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/></g>`

export function LiniqoApartmentBlockBalconies(props: Omit<IllustrationProps, "art" | "svg" | "label"> & { label?: string }) {
  return <Illustration art={art} label="Apartment block with balconies" {...props} />
}
