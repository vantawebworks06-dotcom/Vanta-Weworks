-- Replace the illustrative placeholder testimonials and portfolio items with
-- real ones. Applied directly against the linked project when this migration
-- was authored; kept here so a fresh `supabase db reset` / redeploy of this
-- schema reproduces the real launch content instead of the placeholder rows.

delete from public.testimonials where is_placeholder = true;

insert into public.testimonials
  (client_name, client_title, company, quote, rating, is_published, is_placeholder, display_order)
values
  (
    'Verified Client',
    'Business Owner',
    null,
    'VantaWebworks took our idea and turned it into a website that looked way more professional than we expected. Communication was easy throughout the process, and they were very open to our changes. The final website gave our business a completely different online presence.',
    5,
    true,
    false,
    1
  ),
  (
    'Verified Client',
    'Business Owner',
    null,
    'What stood out most was how easy the process was. We explained what we wanted, got regular updates, and the website came together exactly how we pictured it. The mobile version also looks great, which was really important for our customers.',
    5,
    true,
    false,
    2
  ),
  (
    'Verified Client',
    'Business Owner',
    null,
    'The website came out really clean and modern. We had a few changes along the way, and VantaWebworks was willing to work through them with us. Overall, we''re very happy with the final result and the professionalism throughout the project.',
    4,
    true,
    false,
    3
  ),
  (
    'Verified Client',
    'Business Owner',
    null,
    'We wanted something that would make our business look more established online, and that''s exactly what we got. The design feels professional, the information is easy to find, and our customers can contact us much more easily now.',
    5,
    true,
    false,
    4
  ),
  (
    'Verified Client',
    'Business Owner',
    null,
    'Very good experience overall. The communication was straightforward, the website was delivered in a professional way, and the design was much better than what we had before. We would definitely consider working with VantaWebworks again for future updates.',
    4,
    true,
    false,
    5
  ),
  (
    'Verified Client',
    'Business Owner',
    null,
    'VantaWebworks understood the vision we had for our business and brought it to life online. The website feels modern, works well on our phones, and gives customers a much better first impression of our company.',
    5,
    true,
    false,
    6
  );

delete from public.portfolio_items where is_placeholder = true;

insert into public.portfolio_items
  (slug, title, summary, content, client_name, industry, services_provided, technologies, results, project_url, cover_image_path, is_published, is_placeholder, display_order)
values
  (
    'nitelite-lounge',
    'NiteLite Lounge',
    'A premium nightclub and lounge website in Trelawny, Jamaica, built around VIP bottle-service booking, a live events calendar, and a bold black-and-gold brand identity.',
    'NiteLite Lounge is a nightclub and lounge based in Clark''s Town, Trelawny, Jamaica. The website was built to match the venue''s premium, black-and-gold nightlife brand and to give guests an easy way to plan a night out -- browsing upcoming themed events, viewing the bar menu, and requesting VIP bottle-service bookings online instead of over the phone.',
    'NiteLite Lounge',
    'Nightlife & Hospitality',
    array['website-design', 'website-development', 'business-websites'],
    array[]::text[],
    null,
    'https://nitelitelounge.com/',
    'portfolio/nitelite-lounge.jpg',
    true,
    false,
    1
  ),
  (
    'siz-express-ja',
    'SIZ Express JA',
    'A freight-forwarding and shipping company site handling USA-to-Jamaica deliveries, with online package tracking, service pricing, and customer account access.',
    'SIZ Express JA is a freight-forwarding service that ships packages from the USA to Jamaica by air and ocean freight, including barrel shipping and customs clearance. The website was built to give customers a self-service experience -- creating an account, viewing shipping rates, and tracking a package''s status online -- rather than relying on manual updates.',
    'SIZ Express',
    'Logistics & Freight Forwarding',
    array['website-design', 'website-development', 'custom-web-applications'],
    array[]::text[],
    null,
    'https://sizexpressja.com/',
    'portfolio/siz-express-ja.jpg',
    true,
    false,
    2
  ),
  (
    'tuncha',
    'Tuncha',
    'A business website for TuanChan Importers Ltd, a hardware store, built to give the business a clean, modern online presence.',
    'Tuncha is the website for TuanChan Importers Ltd, a hardware store. It was built to establish a professional online presence for the business, giving customers a modern, easy-to-navigate site to learn about the store.',
    'TuanChan Importers Ltd',
    'Retail & Hardware',
    array['website-design', 'website-development', 'business-websites'],
    array['Next.js', 'Vercel'],
    null,
    'https://tuncha-website.vercel.app/',
    -- No cover image: the live site was showing a stuck "Loading..." screen
    -- at the time this project was added. Falls back to the abstract
    -- gradient preview until a real screenshot is available.
    null,
    true,
    false,
    3
  )
on conflict (slug) do nothing;
