import{g as T,n as P,o as M,r as k}from"./chunk-QKBXZ5E4.js";import{$a as d,La as l,Qa as v,T as p,V as C,Va as m,Xa as w,ca as f,da as x,db as i,ea as u,eb as n,fa as b,fb as c,gb as _,jb as h,kb as s,mb as r,nb as y,ob as S,qb as L}from"./chunk-Z6DSEDD3.js";function V(e,o){e&1&&r(0," Welcome back! ")}function D(e,o){e&1&&r(0," Sign in to your account ")}function B(e,o){if(e&1&&r(0),e&2){let t,a=s();S(" You're already signed in as ",(t=a.authService.currentUser())==null?null:t.username," ")}}function j(e,o){e&1&&r(0," Using your TMDB account ")}function z(e,o){if(e&1&&(i(0,"div",5)(1,"div",9)(2,"div",10),u(),i(3,"svg",11),c(4,"path",12),n()(),b(),i(5,"div",13)(6,"h3",14),r(7),n()()()()),e&2){let t=s();l(7),y(t.error())}}function A(e,o){if(e&1){let t=_();i(0,"div",6)(1,"a",15),r(2," Go to Movies "),n(),i(3,"button",16),h("click",function(){f(t);let g=s();return x(g.logout())}),r(4," Sign out "),n()()}}function G(e,o){e&1&&(u(),i(0,"svg",18),c(1,"circle",19)(2,"path",20),n(),r(3," Connecting to TMDB... "))}function H(e,o){e&1&&(i(0,"span",21),u(),i(1,"svg",22),c(2,"path",23),n()(),r(3," Sign in with TMDB "))}function F(e,o){if(e&1){let t=_();i(0,"button",17),h("click",function(){f(t);let g=s();return x(g.login())}),m(1,G,4,0)(2,H,4,0),n()}if(e&2){let t=s();w("disabled",t.isLoading()),l(),d(t.isLoading()?1:2)}}function I(e,o){e&1&&(i(0,"div",8)(1,"div",24)(2,"div",25),c(3,"div",26),n(),i(4,"div",27)(5,"span",28),r(6," Don't have an account? "),n()()(),i(7,"div",29)(8,"a",30),r(9," Create a TMDB account "),n()()())}var E=class e{authService=p(k);router=p(P);isLoading=v(!1);error=v(null);login(){this.isLoading.set(!0),this.error.set(null),this.authService.login().subscribe({error:o=>{this.isLoading.set(!1),this.error.set("Failed to connect to TMDB. Please try again."),console.error("Login error:",o)}})}logout(){this.authService.logout(),this.router.navigate(["/"])}static \u0275fac=function(t){return new(t||e)};static \u0275cmp=C({type:e,selectors:[["app-login-page"]],standalone:!0,features:[L],decls:14,vars:5,consts:[[1,"min-h-screen","flex","items-center","justify-center","bg-gray-50","py-12","px-4","sm:px-6","lg:px-8"],[1,"max-w-md","w-full","space-y-8"],["src","assets/tmdb-logo.svg","alt","TMDB Logo",1,"mx-auto","h-12","w-auto"],[1,"mt-6","text-center","text-3xl","font-extrabold","text-gray-900"],[1,"mt-2","text-center","text-sm","text-gray-600"],[1,"rounded-md","bg-red-50","p-4"],[1,"flex","flex-col","gap-4"],[1,"group","relative","w-full","flex","justify-center","py-3","px-4","border","border-transparent","text-sm","font-medium","rounded-md","text-white","bg-indigo-600","hover:bg-indigo-700","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500","disabled:opacity-50",3,"disabled"],[1,"mt-6"],[1,"flex"],[1,"flex-shrink-0"],["viewBox","0 0 20 20","fill","currentColor",1,"h-5","w-5","text-red-400"],["fill-rule","evenodd","d","M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z","clip-rule","evenodd"],[1,"ml-3"],[1,"text-sm","font-medium","text-red-800"],["routerLink","/movies",1,"w-full","flex","justify-center","py-3","px-4","border","border-transparent","text-sm","font-medium","rounded-md","text-white","bg-indigo-600","hover:bg-indigo-700","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500"],[1,"w-full","flex","justify-center","py-3","px-4","border","border-gray-300","text-sm","font-medium","rounded-md","text-gray-700","bg-white","hover:bg-gray-50","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500",3,"click"],[1,"group","relative","w-full","flex","justify-center","py-3","px-4","border","border-transparent","text-sm","font-medium","rounded-md","text-white","bg-indigo-600","hover:bg-indigo-700","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500","disabled:opacity-50",3,"click","disabled"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24",1,"animate-spin","-ml-1","mr-3","h-5","w-5","text-white"],["cx","12","cy","12","r","10","stroke","currentColor","stroke-width","4",1,"opacity-25"],["fill","currentColor","d","M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",1,"opacity-75"],[1,"absolute","left-0","inset-y-0","flex","items-center","pl-3"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 0 20 20","fill","currentColor",1,"h-5","w-5","text-indigo-500","group-hover:text-indigo-400"],["fill-rule","evenodd","d","M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z","clip-rule","evenodd"],[1,"relative"],[1,"absolute","inset-0","flex","items-center"],[1,"w-full","border-t","border-gray-300"],[1,"relative","flex","justify-center","text-sm"],[1,"px-2","bg-gray-50","text-gray-500"],[1,"mt-6","text-center"],["href","https://www.themoviedb.org/signup","target","_blank",1,"font-medium","text-indigo-600","hover:text-indigo-500"]],template:function(t,a){t&1&&(i(0,"div",0)(1,"div",1)(2,"div"),c(3,"img",2),i(4,"h2",3),m(5,V,1,0)(6,D,1,0),n(),i(7,"p",4),m(8,B,1,1)(9,j,1,0),n()(),m(10,z,8,1,"div",5)(11,A,5,0,"div",6)(12,F,3,2,"button",7)(13,I,10,0,"div",8),n()()),t&2&&(l(5),d(a.authService.isAuthenticated()?5:6),l(3),d(a.authService.isAuthenticated()?8:9),l(2),d(a.error()?10:-1),l(),d(a.authService.isAuthenticated()?11:12),l(2),d(a.authService.isAuthenticated()?-1:13))},dependencies:[T,M],encapsulation:2})};export{E as LoginPageComponent};